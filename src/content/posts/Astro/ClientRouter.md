---
title: "ClientRouterについて"
pubDate: 2026-08-09
description: "ClientRouterのページ遷移に合わせてDOMを初期化し、必要な要素の状態を維持する。"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["astro", "view-transitions", "spa", "frontend"]
---

Astroの `ClientRouter` を共通レイアウトに置くと、対応する内部リンクでは移動先のHTMLを取得し、現在のページを入れ替える。この方式ではドキュメントを読み直したときにだけ動く初期化処理を、遷移後にも呼ぶ必要がある。

## 遷移後のDOMを初期化する

通常のページ読み込みでは `DOMContentLoaded` で要素を探せる。クライアント側の遷移では、新しいDOMの準備後に `astro:page-load` が発火する。次は説明用の最小構成。イベントの購読は共有スクリプトで行い、各回で現在のDOMを検索する。

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
<script>
  document.addEventListener('astro:page-load', () => {
    document.querySelector('main h1')?.classList.add('ready');
  });
</script>
```

## 残す要素を選ぶ

`transition:persist` の対応する要素が移動先にもあれば、遷移をまたいでDOMやコンポーネントの状態を維持できる。例えば再生中の音声は維持し、記事ごとの本文は入れ替える。JavaScriptを無効にした場合、通常のリンクはブラウザのページ読み込みで機能する。

- [AstroのView transitionsガイド](https://docs.astro.build/en/guides/view-transitions/)
