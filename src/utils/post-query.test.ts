import { expect, mock, test } from "bun:test"
mock.module("astro:content",()=>({
    getCollectio: async () => [{
    scheme:{
        title: "Article1",
        pubDate: new Date("2026-01-01"),
        description: "Test Article1 Description",
        auther: "Auther 1",
        image:{
            url: "cute girl image url 1",
            alt: "cute girl image alt 1"
        }
    }}]
}))
test("getPost Func",async ()=>{
    const { getPosts } = await import("./post-query");
    const posts = await getPosts();
    expect(posts).toHaveLength(1);
    console.log(posts)
})

test("getGroup Func",async ()=>{
    const { getGroup } = await import("./post-query");
    const posts = await getGroup();
    console.log(posts)
})
