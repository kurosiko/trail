---
title: "Bunにおけるテスト"
pubDate: 2026-08-31
description: "Astroのコンテンツ取得をBunでモックし、記事一覧の絞り込みをテストする。"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["bun"]
---

Trailの開発で初めてBunのテストを書いた。記事一覧の処理は、Astroが提供する `astro:content` から記事を取得する。Bun単体でテストすると、Astroのビルド時に解決されるモジュールをそのまま呼べない。そこで記事を返す部分だけモックに置き換え、絞り込みとグループ分けの処理を確認する。

## モジュールを読み込む前に置き換える

以下は `src/utils/post-query.test.ts` の処理を短くした説明例。`getCollection` の名前、戻り値の `data`、絞り込み関数の扱いを、テスト対象が使うインターフェースに合わせる。モックの登録後に、動的importで対象モジュールを読み込む。

```ts
import { expect, mock, test } from "bun:test";

const entry = { data: { draft: false, tags: ["astro"], pubDate: new Date() } };
mock.module("astro:content", () => ({
  getCollection: async (_name: string, filter: (post: typeof entry) => boolean) =>
    [entry].filter(filter),
}));

test("指定したトピックの記事を返す", async () => {
  const { getPosts } = await import("./post-query");
  expect(await getPosts("astro")).toHaveLength(1);
  expect(await getPosts("unknown")).toHaveLength(0);
});
```

例えばモックのエクスポート名に誤字があると、テスト関数の中で対象モジュールを読み込んだ時点で止まる。一方、絞り込みを無視するモックでは、該当記事が0件のケースを正しく確認できない。

Bunの型定義は `bun add -d @types/bun` で追加できる。TrailではBun 1.3.13の `bun test src/utils/post-query.test.ts` で、トピック・下書きの絞り込みと元のディレクトリ名によるグループ分けの2件が通った。実際のMarkdownの読み込みとルートの生成はAstroのビルドで確認する。

- [BunのMocks](https://bun.com/docs/test/mocks)
