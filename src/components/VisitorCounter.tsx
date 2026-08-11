import { useEffect, useState } from "preact/hooks";

type VisitorResponse = {
	count: number;
	counted?: boolean;
};

export default function VisitorCounter() {
	const [count, setCount] = useState<number | null>(null);
	const [unavailable, setUnavailable] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const registerVisitor = async () => {
			try {
				const response = await fetch("/api/visitors", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						Accept: "application/json",
						"X-Requested-With": "XMLHttpRequest",
					},
				});

				if (!response.ok) throw new Error("visitor counter unavailable");
				const data = (await response.json()) as VisitorResponse;

				if (!cancelled && Number.isFinite(data.count)) {
					setCount(data.count);
				}
			} catch {
				if (!cancelled) setUnavailable(true);
			}
		};

		void registerVisitor();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div class="visitor-counter" aria-live="polite" aria-label="来場者カウンター">
			<span class="visitor-counter__label">VISITORS</span>
			<strong class="visitor-counter__value">
				{count === null ? (unavailable ? "—" : "…") : count.toLocaleString("ja-JP")}
			</strong>
			<span class="visitor-counter__note">unique visitors</span>
		</div>
	);
}
