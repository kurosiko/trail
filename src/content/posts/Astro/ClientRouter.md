---
title: "ClientRouterについて"
pubDate: 2026-08-09
description: "ClientRouterについて"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["astro", "view-transitions", "spa", "frontend"]
---
## ClientRouter

### ClientRouterとは

SPA風の遷移を提供する。

`Layout.astro`など、ルート階層の`<head>`に配置する。

```astro
---
// src/layouts/Layout.astro
import { ClientRouter } from 'astro:transitions';
---
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>Trail</title>
    <!-- Here -->
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```

1. **フルリロードの防止**
   - SPA風の遷移
   - 遷移前に移動先のHTMLをfetchし、差分を更新
   - JS無効時はMPAに切り替え

2. **状態・DOMの永続化(`transition:persist`)**
   - 遷移後も状態を保持
   - アンマウント・再マウントを防止

3. **アニメーションの追加**
   - View Transitions APIをベースにする
   - [Build in animation directives](https://docs.astro.build/ja/guides/view-transitions/#built-in-animation-directives)

4. **ライフサイクルイベントの提供**
   - ClientRouter使用時はDOMContentLoadedなどが発火しないため、代替イベントを提供
   - [Lifecycle events](https://docs.astro.build/ja/guides/view-transitions/#lifecycle-events)
