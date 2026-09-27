---
title: "Bit-O-Asm-4"
pubDate: 2026-09-19
description: "cmpとjleの分岐を追ってeaxの値を求める"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Bit-O-Asm-4

> **Q.** `eax` レジスタの値は？

```asm
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0x4],0x9fe1a
<+22>:    cmp    DWORD PTR [rbp-0x4],0x2710
<+29>:    jle    0x55555555514e <main+37>
<+31>:    sub    DWORD PTR [rbp-0x4],0x65
<+35>:    jmp    0x555555555152 <main+41>
<+37>:    add    DWORD PTR [rbp-0x4],0x65
<+41>:    mov    eax,DWORD PTR [rbp-0x4]
<+44>:    pop    rbp
<+45>:    ret
```

最初の命令で関数の準備を行い、`edi` と `rsi` をスタックに保存する。`[rbp-0x4]` には `0x9fe1a` を代入する。

```asm
<+22>:    cmp    DWORD PTR [rbp-0x4],0x2710
```

`cmp` は2つの値を比較し、差に応じてフラグを更新する。メモリ上の値は変更しない。

```text
[rbp-0x4] - 0x2710
= 0x9fe1a - 0x2710
= 0x9d70a
= 644874
```

結果は正なので、符号付き比較の「以下」は偽になる。

```asm
<+29>:    jle    0x55555555514e <main+37>
```

`jle` は符号付きで左辺が右辺以下なら `<+37>` に移動する。今回は移動せず、`<+31>` を実行する。

```asm
<+31>:    sub    DWORD PTR [rbp-0x4],0x65
```

`[rbp-0x4]` から `0x65` を引く。

```text
[rbp-0x4] = 0x9fe1a - 0x65
           = 0x9fdb5
           = 654773
```

次の `jmp` で `<+41>` に移動する。`<+37>` の `add` は実行しない。

```asm
<+35>:    jmp    0x555555555152 <main+41>
```

`<+41>` で `[rbp-0x4]` の値を `eax` に読み込む。

```asm
<+41>:    mov    eax,DWORD PTR [rbp-0x4]
```

その後、関数から戻る。

```asm
<+44>:    pop    rbp
<+45>:    ret
```

最終的な `eax` の値は `654773`。

```text
picoCTF{654773}
```
