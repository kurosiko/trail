interface Post {
	title: string;
	href: string;
	publishedAt: string;
	publishedLabel: string;
}

interface Props {
	posts: Post[];
}

export default function BlogPage({ posts }: Props) {
	return (
		<section>
			<p class="eyebrow">Blog</p>
			<h1>記事一覧</h1>
			<ul class="post-list">
				{posts.map((post) => (
					<li key={post.href}>
						<a href={post.href}>
							<span>{post.title}</span>
							<time dateTime={post.publishedAt}>{post.publishedLabel}</time>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
