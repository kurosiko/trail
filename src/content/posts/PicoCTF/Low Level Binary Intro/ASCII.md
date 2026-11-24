---
title: "ASCIIの16進表記と文字変換"
pubDate: 2026-09-01
description: "16進数のバイト列をASCII文字列に変換する"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

変換は1バイトずつ行う。例えば `0x41` は整数の65で、ASCIIでは文字 `A` に対応する。

```text
16進の1バイト    整数値    ASCII
0x41        ->    65  ->    A
```

> **Q.** 16進数で表されたバイト列をASCII文字列に変換する

[CyberChef](https://gchq.github.io/CyberChef/)の「From Hex」で16進数のバイト列を文字列に変換する。

```text
picoCTF{45c11_n0_qu35710n5_1ll_t311_y3_n0_l135_445d4180}
```
