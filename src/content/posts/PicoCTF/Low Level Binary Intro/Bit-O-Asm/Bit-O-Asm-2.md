---
title: "Bit-O-Asm-2"
pubDate: 2026-09-19
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Bit-O-Asm-2

> **Q.** eaxレジスタの値は?

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

```asm
<+0>:     endbr64 
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
```
Bit-O-Asm-1と同じく、関数の準備。  
`[rbp-0x14]` に `edi` を格納  
`[rbp-0x20]` に `rsi` を格納  
`[rbp-0x4]` に `0x9fe1a` を代入  
`eax` に `[rbp-0x4]` の値を格納  

`[rbp-0x4]` 経由で `0x9fe1a` が `eax` に入る。  
`0x9fe1a = 654874` なので、

```text
picoCTF{654874}
```