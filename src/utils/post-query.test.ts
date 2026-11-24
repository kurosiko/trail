import { expect, mock, test } from "bun:test";
import type { Post } from "./post-query";

const posts: Post[] = [
	{
		id: "astro/first",
		collection: "posts",
		filePath: "src/content/posts/Astro/first.md",
		data: {
			title: "First",
			pubDate: new Date("2026-01-01"),
			description: "First article",
			author: "Author",
			tags: ["astro"],
			draft: false,
		},
	},
	{
		id: "astro/draft",
		collection: "posts",
		filePath: "src/content/posts/Astro/draft.md",
		data: {
			title: "Draft",
			pubDate: new Date("2026-01-02"),
			description: "Draft article",
			author: "Author",
			tags: ["astro"],
			draft: true,
		},
	},
];

mock.module("astro:content", () => ({
	getCollection: async (_collection: "posts", filter: (post: Post) => boolean) =>
		posts.filter(filter),
}));

test("getPosts filters by topic and excludes drafts", async () => {
	const { getPosts } = await import("./post-query");
	expect((await getPosts("astro")).map(({ id }) => id)).toEqual(["astro/first"]);
	expect(await getPosts("unknown")).toEqual([]);
});

test("getPostGroups groups posts by the original directory name", async () => {
	const { getPostGroups, getPosts } = await import("./post-query");
	expect(getPostGroups(await getPosts())).toEqual([
		{ provider: "Astro", courses: new Map(), directPosts: [posts[0]] },
	]);
});
