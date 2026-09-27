---
title: "Bit-O-Asm-3"
pubDate: 2026-09-19
description: "imulとaddの計算結果からeaxの値を求める"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Bit-O-Asm-3

> **Q.** `eax` レジスタの値は？

```asm
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0xc],0x9fe1a
<+22>:    mov    DWORD PTR [rbp-0x8],0x4
<+29>:    mov    eax,DWORD PTR [rbp-0xc]
<+32>:    imul   eax,DWORD PTR [rbp-0x8]
<+36>:    add    eax,0x1f5
<+41>:    mov    DWORD PTR [rbp-0x4],eax
<+44>:    mov    eax,DWORD PTR [rbp-0x4]
<+47>:    pop    rbp
<+48>:    ret
```

まず関数の準備と値の保存を行う。

```asm
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0xc],0x9fe1a
<+22>:    mov    DWORD PTR [rbp-0x8],0x4
```

`edi` と `rsi` をスタックに保存する。`[rbp-0xc]` に `0x9fe1a`、`[rbp-0x8]` に `0x4` を代入する。

次に、`0x9fe1a` を `eax` に読み込み、`0x4` を掛ける。

```asm
<+29>:    mov    eax,DWORD PTR [rbp-0xc]
<+32>:    imul   eax,DWORD PTR [rbp-0x8]
```

この時点の値は次の通り。

```text
eax = 0x9fe1a
eax = 0x9fe1a × 0x4
   = 0x27f868
   = 2619496
```

`imul` の結果は `eax` に格納される。

次に、`eax` に `0x1f5` を加算する。

```asm
<+36>:    add    eax,0x1f5
```

`0x1f5` は10進数で `501`。計算結果は次の通り。

```text
eax = 0x27f868 + 0x1f5
    = 0x27fa5d
    = 2619997
```

計算結果を `[rbp-0x4]` に保存し、もう一度 `eax` に読み込む。

```asm
<+41>:    mov    DWORD PTR [rbp-0x4],eax
<+44>:    mov    eax,DWORD PTR [rbp-0x4]
```

最後に関数から戻る。`eax` の値が答えになる。

```asm
<+47>:    pop    rbp
<+48>:    ret
```

答えは `2619997`。

```text
picoCTF{2619997}
```
