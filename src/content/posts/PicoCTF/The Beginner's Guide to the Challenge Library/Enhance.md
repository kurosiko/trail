---
title: "Enhance"
pubDate: 2026-08-26
description: "SVGファイルからflagを見つける問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Enhance

> **Q.** SVGファイルの中からflagを探せ

flagは`metadata`ではなく、画像内の小さな円に埋め込まれている。
選択して右クリックすると取得できる。


```text
p i c o C T F { 3 n h 4 n
c 3 d _ a a b 7 2 9 d d }
```
が得られる。

vimの`:s/ //g`で行内の空白を削除する。

**Flag:** `picoCTF{3nh4nc3d_aab729dd}`
