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

Trailの開発で初めてBunの機能を使ったテストを書く。


Trailの記事階層を区別するため、pathからオブジェクトを生成して返す関数を作る。

Bunの型を認識できなかったため、手動で追加する。
```shell
$bun add -d @types/bun

```
次にmodule.test.tsを書く。
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
処理の流れ:
astro:contentのmockを作る。

mockはテスト用の偽データ。
返すデータの型によって扱いは異なる。

post-query.tsからgetPosts関数を読み込む。
`posts`に`getPosts`の結果を入れ、`expect(posts)`で要素数1を確認する。

```ts
$bun test src/utils/post-query.test.ts
```
テストを実行する。

```
bun test v1.3.13 (bf2e2cec)

src/utils/post-query.test.ts:
✓ getPost Func [0.82ms]

 1 pass
 0 fail
 1 expect() calls
Ran 1 test across 1 file. [14.00ms]
```

テスト結果はこのように表示される。
テストの実行結果も確認できた。

今回はmodule mockを使った。
