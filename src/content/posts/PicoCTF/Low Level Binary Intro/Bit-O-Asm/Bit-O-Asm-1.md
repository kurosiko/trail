---
title: "Bit-O-Asm-1"
pubDate: 2026-09-01
description: "eaxに代入された即値を10進数に変換する"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Bit-O-Asm-1

> **Q.** `eax` レジスタの値は？

`picoCTF{n}` の `n` を10進数で求める。

命令を順に確認する。

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
`DWORD PTR` は4バイト、`QWORD PTR` は8バイトのメモリアクセスを表す。最初の2つの `mov` は `edi` と `rsi` をスタックに保存する。答えに関係するのは `<+15>` の命令で、`eax` に `0x30` を代入する。`0x30` は10進数で `48`。

```text
picoCTF{48}
```
