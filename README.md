# Trail

Trailは単なる私個人の技術ブログです。writeupとか雑に上げます
[trail](https://trail.kurosiko.com)

## build and debugging

```sh
bun install
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

## add posts

`src/content/posts/` に Markdown ファイルを追加します。
```md
---
title: "記事のタイトル"
pubDate: 2026-09-27
description: "記事の概要"
author: "kurosiko"
tags: ["astro", "frontend"]
draft: false
---

# タイトル
本文
```

