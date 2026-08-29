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

metadataとかに乗ってるのかなとか思ってたら力技でした
めっちゃちっちゃい
円の中にある
選択状態にして右クリックしたら意外と簡単に取れる


```text
p i c o C T F { 3 n h 4 n
c 3 d _ a a b 7 2 9 d d }
```
が得られる

`:s/ //g`
vimはこれで行の中を置換できるらしい

**Flag:** `picoCTF{3nh4nc3d_aab729dd}`
