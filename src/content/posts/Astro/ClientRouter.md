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

SPAのような遷移を提供する

`Layout.astro`などのルート階層の`<head>`内に配置することが一般的

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
   - SPA"風"である
   - 遷移の前に移動先のHTMLをfetchして差分を更新する
   - JSが無効な時はMPAに切り替わる

2. **状態・DOMの永続化(`transition:persisit`)**
   - 遷移による状態を保持できる
   - アンマウント・再マウントの防止

3. **アニメーションの追加**
   - WebViewTransitions APIをベースに作られている
   - [Build in animation directives](https://docs.astro.build/ja/guides/view-transitions/#built-in-animation-directives)

4. **ライフサイクルイベントの提供**
   - ClientRouterを使用すると従来のDOMContentLoadedなどが発火しなくなるため提供
   - [Lifecycle events](https://docs.astro.build/ja/guides/view-transitions/#lifecycle-events)
