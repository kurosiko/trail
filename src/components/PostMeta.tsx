interface Props {
	publishedAt: string;
	publishedLabel: string;
	author: string;
	tags: string[];
}

export default function PostMeta({
	publishedAt,
	publishedLabel,
	author,
	tags,
}: Props) {
	return (
		<header class="post-header">
			<p class="eyebrow">Blog</p>
			<p>
				<time dateTime={publishedAt}>{publishedLabel}</time>
				{" · "}
				<span>{author}</span>
			</p>
			<ul class="tag-list" aria-label="タグ">
				{tags.map((tag) => (
					<li key={tag}>{tag}</li>
				))}
			</ul>
		</header>
	);
}
