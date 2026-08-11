import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { APIRoute } from "astro";

const COOKIE_NAME = "trail_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 730;
const FINGERPRINT_RETENTION_MS = 1000 * 60 * 60 * 24 * 90;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;

type VisitorStore = {
	version: 1;
	total: number;
	visitorIds: Record<string, number>;
	networkKeys: Record<string, number>;
	updatedAt: string;
};

const rateLimit = new Map<string, { startedAt: number; count: number }>();
let loadedStore: VisitorStore | undefined;
let writeQueue = Promise.resolve();

function storePath() {
	return resolve(process.env.VISITOR_COUNTER_FILE ?? ".data/visitors.json");
}

function secret() {
	const configured = process.env.VISITOR_COUNTER_SECRET;
	if (configured) return configured;
	if (import.meta.env.PROD) {
		throw new Error("VISITOR_COUNTER_SECRET must be configured in production");
	}
	return "local-development-only-change-me";
}

function emptyStore(): VisitorStore {
	return {
		version: 1,
		total: 0,
		visitorIds: {},
		networkKeys: {},
		updatedAt: new Date(0).toISOString(),
	};
}

async function readStore() {
	if (loadedStore) return loadedStore;

	try {
		const parsed = JSON.parse(await readFile(storePath(), "utf8")) as Partial<VisitorStore>;
		loadedStore = {
			version: 1,
			total: Number.isSafeInteger(parsed.total) && parsed.total! >= 0 ? parsed.total! : 0,
			visitorIds: parsed.visitorIds && typeof parsed.visitorIds === "object" ? parsed.visitorIds : {},
			networkKeys: parsed.networkKeys && typeof parsed.networkKeys === "object" ? parsed.networkKeys : {},
			updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
		};
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
		loadedStore = emptyStore();
	}

	return loadedStore;
}

async function persistStore(store: VisitorStore) {
	const target = storePath();
	await mkdir(dirname(target), { recursive: true });
	const temporary = `${target}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
	await writeFile(temporary, JSON.stringify(store), { encoding: "utf8", mode: 0o600 });
	await rename(temporary, target);
}

async function updateStore<T>(update: (store: VisitorStore) => Promise<T> | T) {
	const operation = writeQueue.then(async () => {
		const store = await readStore();
		const result = await update(store);
		store.updatedAt = new Date().toISOString();
		await persistStore(store);
		return result;
	});
	writeQueue = operation.then(
		() => undefined,
		() => undefined,
	);
	return operation;
}

function digest(value: string) {
	return createHmac("sha256", secret()).update(value).digest("hex");
}

function signVisitorId(id: string) {
	return digest(`visitor:${id}`);
}

function newVisitorId() {
	return randomBytes(32).toString("hex");
}

function getVisitorId(rawCookie: string | undefined) {
	if (!rawCookie) return undefined;
	const [id, signature] = rawCookie.split(".");
	if (!/^[a-f0-9]{64}$/.test(id) || !/^[a-f0-9]{64}$/.test(signature ?? "")) return undefined;

	const expected = Buffer.from(signVisitorId(id), "hex");
	const actual = Buffer.from(signature, "hex");
	return timingSafeEqual(expected, actual) ? id : undefined;
}

function getClientIp(request: Request, clientAddress: string | undefined) {
	if (clientAddress) return clientAddress;
	// Only trust forwarding headers when the deployment proxy is known to overwrite them.
	if (process.env.VISITOR_TRUST_PROXY !== "true") return undefined;
	const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	return (
		request.headers.get("cf-connecting-ip")?.trim() ||
		request.headers.get("x-real-ip")?.trim() ||
		forwarded ||
		undefined
	);
}

function getNetworkKey(request: Request, clientAddress: string | undefined) {
	const ip = getClientIp(request, clientAddress);
	if (!ip) return undefined;
	const userAgent = request.headers.get("user-agent") ?? "";
	return digest(`network:${ip}\n${userAgent}`);
}

function isRateLimited(request: Request, clientAddress: string | undefined) {
	const key = getClientIp(request, clientAddress) ?? "unknown";
	const now = Date.now();
	const current = rateLimit.get(key);
	if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
		rateLimit.set(key, { startedAt: now, count: 1 });
		return false;
	}
	current.count += 1;
	return current.count > RATE_LIMIT;
}

function pruneFingerprints(store: VisitorStore, now: number) {
	const oldestAllowed = now - FINGERPRINT_RETENTION_MS;
	for (const [key, seenAt] of Object.entries(store.visitorIds)) {
		if (!Number.isFinite(seenAt) || seenAt < oldestAllowed) delete store.visitorIds[key];
	}
	for (const [key, seenAt] of Object.entries(store.networkKeys)) {
		if (!Number.isFinite(seenAt) || seenAt < oldestAllowed) delete store.networkKeys[key];
	}
}

function json(data: object, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Cache-Control": "no-store",
			"Content-Type": "application/json; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
			Vary: "Cookie",
		},
	});
}

export const GET: APIRoute = async ({ request, clientAddress }) => {
	if (isRateLimited(request, clientAddress)) return json({ error: "too many requests" }, 429);
	const store = await readStore();
	return json({ count: store.total });
};

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
	if (isRateLimited(request, clientAddress)) return json({ error: "too many requests" }, 429);

	const origin = request.headers.get("origin");
	if (origin && origin !== new URL(request.url).origin) {
		return json({ error: "origin not allowed" }, 403);
	}

	const existingCookie = cookies.get(COOKIE_NAME)?.value;
	const visitorId = getVisitorId(existingCookie) ?? newVisitorId();
	const networkKey = getNetworkKey(request, clientAddress);
	const now = Date.now();

	const counted = await updateStore((store) => {
		pruneFingerprints(store, now);
		const alreadySeen = Boolean(store.visitorIds[visitorId]) || Boolean(networkKey && store.networkKeys[networkKey]);
		if (!alreadySeen) store.total += 1;
		store.visitorIds[visitorId] = now;
		if (networkKey) store.networkKeys[networkKey] = now;
		return !alreadySeen;
	});

	if (!getVisitorId(existingCookie)) {
		cookies.set(COOKIE_NAME, `${visitorId}.${signVisitorId(visitorId)}`, {
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: "lax",
			path: "/",
			maxAge: COOKIE_MAX_AGE,
		});
	}

	const store = await readStore();
	return json({ count: store.total, counted });
};
