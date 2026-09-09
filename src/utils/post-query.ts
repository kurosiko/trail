import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Post = CollectionEntry<"posts">;

export interface PostGroup {
	provider: string;
	courses: Map<string, Post[]>;
	directPosts: Post[];
}

/**
 * Return the path below `src/content/posts` for a collection entry.
 *
 * Astro's `id` is URL-normalized (and therefore loses some information from
 * the directory name), while `filePath` retains the source path.  Grouping
 * by the id can consequently merge courses that only differ by casing or
 * punctuation.  Use the source path whenever it is available and keep the
 * id as a fallback for test fixtures and older Astro entries.
 */
function getSourcePathParts(post: Post): string[] {
	if (post.filePath) {
		const parts = post.filePath.replaceAll("\\", "/").split("/");
		const postsDirectoryIndex = parts.lastIndexOf("posts");
		if (postsDirectoryIndex >= 0) {
			return parts.slice(postsDirectoryIndex + 1);
		}
	}

	return post.id.split("/");
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
 * Organize posts as provider -> course -> posts, preserving every entry.
 * A markdown file directly under a provider is kept in `directPosts`.
 */
export function getPostGroups(posts: Post[]): PostGroup[] {
	const groups = new Map<string, PostGroup>();

	for (const post of posts) {
		const parts = getSourcePathParts(post);
		const provider = parts[0] || "その他";
		let group = groups.get(provider);
		if (!group) {
			group = { provider, courses: new Map(), directPosts: [] };
			groups.set(provider, group);
		}

		// parts = provider/file means there is no course directory.
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

export async function getGroup(){
    const res = await getCollection("posts")
    console.log(res)
}
