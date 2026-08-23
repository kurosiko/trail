---
title: "Bases"
pubDate: 2026-08-24
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
> **Q.** `bDNhcm5fdGgzX3IwcDM1`は何を意味するでしょうか?

Baseって言われているので、Base64 Decodeをしてみる。

```text
l3arn_th3_r0p35
```

が得られた。一応、Learn the ropesと解釈できるものになったので、flagは以下の通り。

**Flag:** `picoCTF{l3arn_th3_r0p35}`
