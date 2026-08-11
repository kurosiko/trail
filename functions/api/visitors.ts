const COOKIE_NAME = "trail_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 730;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const RATE_RETENTION_MS = 24 * 60 * 60 * 1000;

interface Env {
	VISITOR_DB?: D1Database;
	VISITOR_COUNTER_SECRET?: string;
}

type CanonicalRow = { canonical_id: string };
type CountRow = { total: number };
type RateRow = { requests: number };

let cachedHmacKey: { secret: string; key: Promise<CryptoKey> } | undefined;

function json(data: object, status = 200, extraHeaders?: HeadersInit) {
	const headers = new Headers(extraHeaders);
	headers.set("Content-Type", "application/json; charset=utf-8");
	headers.set("X-Content-Type-Options", "nosniff");
	return new Response(JSON.stringify(data), { status, headers });
}

function unavailable(reason: "binding" | "secret" | "schema" | "storage") {
	return json(
		{ count: null, configured: false, error: `visitor counter ${reason} unavailable` },
		503,
		{ "Cache-Control": "no-store" },
	);
}

function hmacKey(secret: string) {
	if (!cachedHmacKey || cachedHmacKey.secret !== secret) {
		cachedHmacKey = {
			secret,
			key: crypto.subtle.importKey(
				"raw",
				new TextEncoder().encode(secret),
				{ name: "HMAC", hash: "SHA-256" },
				false,
				["sign"],
			),
		};
	}
	return cachedHmacKey.key;
}

function base64Url(bytes: Uint8Array) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function digest(secret: string, value: string) {
	const signature = await crypto.subtle.sign(
		"HMAC",
		await hmacKey(secret),
		new TextEncoder().encode(value),
	);
	return base64Url(new Uint8Array(signature));
}

function randomVisitorId() {
	return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
		byte.toString(16).padStart(2, "0"),
	).join("");
}

function cookieValue(request: Request) {
	const cookieHeader = request.headers.get("Cookie");
	if (!cookieHeader) return undefined;
	for (const part of cookieHeader.split(";")) {
		const [name, ...value] = part.trim().split("=");
		if (name === COOKIE_NAME) return value.join("=");
	}
	return undefined;
}

function constantTimeEqual(left: string, right: string) {
	let difference = left.length ^ right.length;
	const length = Math.max(left.length, right.length);
	for (let index = 0; index < length; index += 1) {
		difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
	}
	return difference === 0;
}

async function verifiedVisitorId(request: Request, secret: string) {
	const rawCookie = cookieValue(request);
	if (!rawCookie) return undefined;
	const [id, signature] = rawCookie.split(".");
	if (!/^[a-f0-9]{32}$/.test(id) || !signature) return undefined;
	const expected = await digest(secret, `visitor:${id}`);
	return constantTimeEqual(expected, signature) ? id : undefined;
}

async function signedCookie(visitorId: string, secret: string) {
	const signature = await digest(secret, `visitor:${visitorId}`);
	return `${COOKIE_NAME}=${visitorId}.${signature}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

async function rateLimited(db: D1Database, secret: string, subject: string, now: number) {
	const rateKey = await digest(secret, `rate:${subject}`);
	const windowStart = Math.floor(now / RATE_WINDOW_MS) * RATE_WINDOW_MS;
	const row = await db
		.prepare(
			`INSERT INTO visitor_rate_limits (rate_key, window_start, requests)
			 VALUES (?1, ?2, 1)
			 ON CONFLICT(rate_key) DO UPDATE SET
			   requests = CASE
			     WHEN visitor_rate_limits.window_start = excluded.window_start
			     THEN visitor_rate_limits.requests + 1 ELSE 1 END,
			   window_start = excluded.window_start
			 RETURNING requests`,
		)
		.bind(rateKey, windowStart)
		.first<RateRow>();
	return (row?.requests ?? RATE_LIMIT + 1) > RATE_LIMIT;
}

async function registerVisitor(
	db: D1Database,
	visitorId: string,
	networkKey: string | undefined,
	now: number,
) {
	const known = await db
		.prepare("SELECT canonical_id FROM visitor_ids WHERE visitor_id = ?1")
		.bind(visitorId)
		.first<CanonicalRow>();

	let canonicalId = known?.canonical_id;
	let counted = false;

	if (!canonicalId && networkKey) {
		const inserted = await db
			.prepare(
				`INSERT OR IGNORE INTO visitor_networks
				 (network_key, canonical_id, first_seen, last_seen)
				 VALUES (?1, ?2, ?3, ?3)
				 RETURNING canonical_id`,
			)
			.bind(networkKey, visitorId, now)
			.first<CanonicalRow>();

		if (inserted) {
			canonicalId = inserted.canonical_id;
			counted = true;
		} else {
			canonicalId = (
				await db
					.prepare("SELECT canonical_id FROM visitor_networks WHERE network_key = ?1")
					.bind(networkKey)
					.first<CanonicalRow>()
			)?.canonical_id;
		}
	}

	if (!canonicalId) {
		const inserted = await db
			.prepare(
				`INSERT OR IGNORE INTO visitors (canonical_id, first_seen, last_seen)
				 VALUES (?1, ?2, ?2)
				 RETURNING canonical_id`,
			)
			.bind(visitorId, now)
			.first<CanonicalRow>();
		canonicalId = visitorId;
		counted = Boolean(inserted);
	}

	const statements = [
		db
			.prepare("UPDATE visitors SET last_seen = ?2 WHERE canonical_id = ?1")
			.bind(canonicalId, now),
		db
			.prepare(
				`INSERT INTO visitor_ids (visitor_id, canonical_id, first_seen, last_seen)
				 VALUES (?1, ?2, ?3, ?3)
				 ON CONFLICT(visitor_id) DO UPDATE SET last_seen = excluded.last_seen`,
			)
			.bind(visitorId, canonicalId, now),
	];

	if (networkKey) {
		statements.push(
			db
				.prepare(
					`INSERT OR IGNORE INTO visitor_networks
					 (network_key, canonical_id, first_seen, last_seen)
					 VALUES (?1, ?2, ?3, ?3)`,
				)
				.bind(networkKey, canonicalId, now),
			db
				.prepare("UPDATE visitor_networks SET last_seen = ?2 WHERE network_key = ?1")
				.bind(networkKey, now),
		);
	}

	await db.batch(statements);
	const count = await db
		.prepare("SELECT total FROM visitor_counter WHERE singleton = 1")
		.first<CountRow>();
	if (!count) throw new Error("visitor counter schema is not initialized");
	return { count: count.total, counted };
}

function configured(env: Env) {
	const secret = env.VISITOR_COUNTER_SECRET?.trim();
	if (!env.VISITOR_DB) return { ok: false, response: unavailable("binding") } as const;
	if (!secret || secret.length < 32) {
		return { ok: false, response: unavailable("secret") } as const;
	}
	return { ok: true, db: env.VISITOR_DB, secret } as const;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
	const config = configured(env);
	if (!config.ok) return config.response;

	try {
		const count = await config.db
			.prepare("SELECT total FROM visitor_counter WHERE singleton = 1")
			.first<CountRow>();
		if (!count) return unavailable("schema");
		return json(
			{ count: count.total, configured: true },
			200,
			{ "Cache-Control": "public, max-age=15, s-maxage=15, stale-while-revalidate=60" },
		);
	} catch (error) {
		console.error("Visitor counter GET failed", error);
		return unavailable("storage");
	}
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
	const { env, request } = context;
	const config = configured(env);
	if (!config.ok) return config.response;

	const origin = request.headers.get("Origin");
	if (origin && origin !== new URL(request.url).origin) {
		return json({ error: "origin not allowed" }, 403, { "Cache-Control": "no-store" });
	}
	if (request.headers.get("Sec-Fetch-Site") === "cross-site") {
		return json({ error: "cross-site request not allowed" }, 403, { "Cache-Control": "no-store" });
	}

	try {
		const existingVisitorId = await verifiedVisitorId(request, config.secret);
		const visitorId = existingVisitorId ?? randomVisitorId();
		const clientIp = request.headers.get("CF-Connecting-IP")?.trim();
		const userAgent = request.headers.get("User-Agent") ?? "";
		const language = request.headers.get("Accept-Language") ?? "";
		const networkKey = clientIp
			? await digest(config.secret, `network:${clientIp}\n${userAgent}\n${language}`)
			: undefined;

		if (await rateLimited(config.db, config.secret, clientIp ?? visitorId, Date.now())) {
			return json({ error: "too many requests" }, 429, {
				"Cache-Control": "no-store",
				"Retry-After": "60",
			});
		}

		const result = await registerVisitor(config.db, visitorId, networkKey, Date.now());
		const headers = new Headers({ "Cache-Control": "no-store" });
		if (!existingVisitorId) {
			headers.append("Set-Cookie", await signedCookie(visitorId, config.secret));
		}

		if (crypto.getRandomValues(new Uint8Array(1))[0] === 0) {
			context.waitUntil(
				config.db
					.prepare("DELETE FROM visitor_rate_limits WHERE window_start < ?1")
					.bind(Date.now() - RATE_RETENTION_MS)
					.run()
					.then(() => undefined)
					.catch((error) => console.error("Visitor rate-limit cleanup failed", error)),
			);
		}

		return json({ ...result, configured: true }, 200, headers);
	} catch (error) {
		console.error("Visitor counter POST failed", error);
		return unavailable("storage");
	}
};
