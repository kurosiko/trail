import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Post = CollectionEntry<"posts">;

export async function getPosts(topic?: string): Promise<Post[]> {
	const normalizedTopic = topic?.trim();

	return (await getCollection("posts", ({ data }) => {
		return !data.draft && (!normalizedTopic || data.tags.includes(normalizedTopic));
	})).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getTopics(posts: Post[]): string[] {
	return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
		a.localeCompare(b),
	);
}
