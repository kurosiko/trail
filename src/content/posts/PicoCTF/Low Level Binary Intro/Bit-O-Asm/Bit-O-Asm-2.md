---
title: "Bit-O-Asm-2"
pubDate: 2026-09-19
description: "スタック上の値をeaxに読み込み、10進数に変換する"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Bit-O-Asm-2

> **Q.** `eax` レジスタの値は？

```asm
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0x4],0x9fe1a
<+22>:    mov    eax,DWORD PTR [rbp-0x4]
<+25>:    pop    rbp
<+26>:    ret
```

最初の3命令は関数の準備。続いて `edi` と `rsi` をスタックに保存する。`[rbp-0x4]` に `0x9fe1a` を書き込み、その値を `eax` に読み込む。`0x9fe1a` は10進数で `654874`。

```text
picoCTF{654874}
```
