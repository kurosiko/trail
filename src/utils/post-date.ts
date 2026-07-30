export function getPostDate(date: Date) {
	const datetime = date.toISOString().slice(0, 10);

	return {
		datetime,
		label: datetime.replaceAll("-", "."),
	};
}
