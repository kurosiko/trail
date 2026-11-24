---
title: "Base64の符号化とデコード"
pubDate: 2026-08-24
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
> **Q.** `bDNhcm5fdGgzX3IwcDM1`は何を意味するでしょうか?

入力をBase64としてデコードする。Base64はバイト列を文字で表す符号化方式。復元に鍵は要らない。

```text
l3arn_th3_r0p35
```

`Learn the ropes`と読める。flagは以下。

**Flag:** `picoCTF{l3arn_th3_r0p35}`

- [RFC 4648 §4 Base64 Encoding](https://www.rfc-editor.org/rfc/rfc4648.html#section-4)
