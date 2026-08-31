---
title: "Bunにおけるテスト"
pubDate: 2026-08-31
description: "Bunにおけるテスト駆動"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["bun"]
---

# Bunにおけるテスト

恥ずかしながらここまでbunの機能を使ってテストをしたことがなかったので今回のtrailの開発の中でテストを書いてみた


このタイミングでtrailの記事の階層を区別して表示するためにpathからオブジェクトを生成して返す関数の作成をしている

まずデフォルトだとbunの型を認識してくれなかったので手動で追加する
```shell
$bun add -d @types/bun

```
そしたらmodule.test.tsを書いていく
```ts
import { expect, mock, test } from "bun:test"

mock.module("astro:content",()=>({
    getCollection: async () => [{
    data:{
        draft:false,
        tags: ["Astro"],
        pubDate: new Date("2026-01-01")
    }}]
}))

test("getPost Func",async ()=>{
    const { getPosts } = await import("./post-query");
    const posts = await getPosts();

    expect(posts).toHaveLength(1);
})

```
動作としては
astro:contentのmockを作成する

mockとはテストなどに使う偽のデーターだと思ってくれればいい
(厳密には返すデーターの種類によって違うらしい)

そして、post-query.tsからgetPost関数を読み込む
postsに対してgetPosts関数の実行結果を返し、expect(posts)でpostsが1つの要素を持つことをチェックしている。

```ts
$bun test src/utils/post-query.test.ts
```
で実行する

```
bun test v1.3.13 (bf2e2cec)

src/utils/post-query.test.ts:
✓ getPost Func [0.82ms]

 1 pass
 0 fail
 1 expect() calls
Ran 1 test across 1 file. [14.00ms]
```

といった感じで結果が出てくる
しっかりconsole.logした結果としても得られた。

今回はmoduleのmockだったが色々なタイプのmockがあるみたいなので使えるところは使っていきたい。
