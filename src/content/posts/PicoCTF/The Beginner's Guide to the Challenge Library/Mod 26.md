---
title: "ROT13の文字変換と二重適用"
pubDate: 2026-08-24
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
> **Q.** 暗号学は簡単だよ、ROT13って知ってるかな?

ROT13を調べる。
「**Rot**ate by **13** places」の略で、シーザー暗号の一種。アルファベットを13文字ずらす。

アルファベット26文字の半分だけずらすので、同じ操作を2回適用すると元に戻る。

```text
A ──13文字ずらす──> N ──13文字ずらす──> A
```

英字の大文字・小文字はそれぞれのアルファベット内で置き換える。数字や記号はそのまま残る。

**Flag:** `picoCTF{next_time_I'll_try_2_rounds_of_rot13_45559abd}`
