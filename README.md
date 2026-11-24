# miseでのセットアップ

```sh
mise install
bun install
```

開発サーバーは既存の`astro dev --background`手順を使います。

# Trail

Trailは単なる私個人の技術ブログです。writeupとか雑に上げます
[trail](https://trail.kurosiko.com)

## build and debugging

```sh
bun install
bun run playwright install --only-shell chromium
bun run astro dev --background
```

```sh
bun run astro dev status
bun run astro dev logs
bun run astro dev stop
```

```sh
bun run build
bun run preview
```

## Cloudflare Pages

Build command は `bun run build:pages`、Build output directory は `dist` に設定します。
ビルド中に Playwright の Chromium で Mermaid を変換し、生成した SVG を記事の HTML に埋め込みます。
Git では Markdown 内の `mermaid` コードブロックを管理します。

## add posts

`src/content/posts/` に Markdown ファイルを追加します。ページの大見出しは frontmatter の `title` から表示されるため、本文の見出しは `##` から始めます。

```md
---
title: "記事のタイトル"
pubDate: 2026-09-27
description: "記事の概要"
author: "kurosiko"
tags: ["astro", "frontend"]
draft: false
---

本文
```

