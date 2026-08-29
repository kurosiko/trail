import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Post = CollectionEntry<"posts">;

export interface PostGroup {
	provider: string;
	courses: Map<string, Post[]>;
	directPosts: Post[];
}

function getSourcePathParts(post: Post): string[] {
	if (!post.filePath) return post.id.split("/");

	const parts = post.filePath.replaceAll("\\", "/").split("/");
	const postsDirectoryIndex = parts.lastIndexOf("posts");
	return postsDirectoryIndex >= 0 ? parts.slice(postsDirectoryIndex + 1) : post.id.split("/");
}

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

/**
 * Organizes posts by their content path: provider/course/item.
 * Posts without a course directory remain directly under their provider.
 */
export function getPostGroups(posts: Post[]): PostGroup[] {
	const groups = new Map<string, PostGroup>();

	for (const post of posts) {
		// filePath preserves the capitalization and punctuation of directory names,
		// while Astro's generated id is normalized for URLs.
		const parts = getSourcePathParts(post);
		const provider = parts[0] || "その他";
		let group = groups.get(provider);

		if (!group) {
			group = { provider, courses: new Map(), directPosts: [] };
			groups.set(provider, group);
		}

		const course = parts.length > 2 ? parts[1] : undefined;
		if (!course) {
			group.directPosts.push(post);
			continue;
		}

		const coursePosts = group.courses.get(course) ?? [];
		coursePosts.push(post);
		group.courses.set(course, coursePosts);
	}

	return [...groups.values()].sort((a, b) => a.provider.localeCompare(b.provider));
}
