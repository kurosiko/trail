import { useEffect, useState } from "preact/hooks";

interface Props {
	year: number;
	initialTime: string;
}

export default function Footer({ year, initialTime }: Props) {
	const [formattedTime, setFormattedTime] = useState(initialTime);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setFormattedTime(new Date().toLocaleTimeString("ja-JP"));
		}, 1000);

		return () => window.clearInterval(timer);
	}, []);

	return (
		<footer>
      <small>
        Copyright &copy; {year} kurosiko All rights reserved.
      </small>
			<time>{formattedTime}</time>
		</footer>
	);
}
