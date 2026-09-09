---
title: "Bit-O-Asm-1"
pubDate: 2026-09-01
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Bit-O-Asm-1

> **Q.** eaxレジスタにどんな値が入っていますか?

今回は`picoCTF{n}`の`n`を求める。
10進数で答える。

ASMを読む。命令を順に確認する。


```asm
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x4],edi
<+11>:    mov    QWORD PTR [rbp-0x10],rsi
<+15>:    mov    eax,0x30
<+20>:    pop    rbp
<+21>:    ret
```
