---
title: "Memory: ARM64"
pubDate: 2026-09-01
description: "ARM64のレジスタ、呼び出し規約、スタックメモリのメモ"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Memory: ARM64

[Memory](/posts/knowledge/memory)から分けた、ARM64（AArch64、Apple Siliconを含む）のメモだ。

ここではAArch64のプロシージャ呼び出し規約（AAPCS64）における、整数・ポインタ引数の基本を扱う。macOSにはAAPCS64を基にした固有規則もあるが、この範囲では共通だ。
第1〜8引数は`x0`〜`x7`（32ビットの値なら`w0`〜`w7`）に渡り、9個目以降は通常スタック側に渡る。
浮動小数点値やベクトル値は主に`v0`〜`v7`を使う。構造体や可変長引数には別の規則があり、「ARM64なら必ず8個」とは限らない。

## Cのコードで確認

```c
#include <stdio.h>

// 引数が 8 個ある関数
int add_all(int a, int b, int c, int d, int e, int f, int g, int h) {
    int sum = a + b + c + d + e + f + g + h;
    return sum; // breakpoint
}

int main(void) {
    int result = add_all(1, 2, 3, 4, 5, 6, 7, 8);
    printf("Result: %d\n", result);
    return 0;
}
```

macOSではApple Clangで最適化をオフ、デバッグ情報をオンにしてコンパイルする。
環境によっては`gcc`が`clang`の互換名だが、ここでは`clang`を使う。

```console
$ clang -g -O0 demo.c -o demo
```

デバッガにはmacOS標準のLLDBを使う。

```console
$ lldb ./demo

(lldb) b add_all
(lldb) r
```

```text
(lldb) b add_all
Breakpoint 1: where = demo`add_all + 36 at demo.c:5:15, address = 0x0000000100000484
(lldb) r
Process 5137 launched: '/path/to/demo' (arm64)
Process 5137 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000484 demo`add_all(a=1, b=2, c=3, d=4, e=5, f=6, g=7, h=8) at demo.c:5:15
   2
   3    // 引数が 8 個ある関数
   4    int add_all(int a, int b, int c, int d, int e, int f, int g, int h) {
-> 5        int sum = a + b + c + d + e + f + g + h;
   6        return sum; // breakpoint
   7    }
   8
Target 0: (demo) stopped.
```

ブレークポイントを置き、`disassemble`で生成された命令を確認する。Apple SiliconはAArch64なので、命令はx86-64と異なる。

Apple Silicon向けのコンパイル例。`-O0`では、引数をいったんスタックへ退避する。

```asm
(lldb) disassemble
demo`add_all:
    0x100000460 <+0>:   sub    sp, sp, #0x30
    0x100000464 <+4>:   str    w0, [sp, #0x2c]
    0x100000468 <+8>:   str    w1, [sp, #0x28]
    0x10000046c <+12>:  str    w2, [sp, #0x24]
    0x100000470 <+16>:  str    w3, [sp, #0x20]
    0x100000474 <+20>:  str    w4, [sp, #0x1c]
    0x100000478 <+24>:  str    w5, [sp, #0x18]
    0x10000047c <+28>:  str    w6, [sp, #0x14]
    0x100000480 <+32>:  str    w7, [sp, #0x10]
->  0x100000484 <+36>:  ldr    w8, [sp, #0x2c]
    0x100000488 <+40>:  ldr    w9, [sp, #0x28]
    0x10000048c <+44>:  add    w8, w8, w9
    0x100000490 <+48>:  ldr    w9, [sp, #0x24]
    0x100000494 <+52>:  add    w8, w8, w9
    0x100000498 <+56>:  ldr    w9, [sp, #0x20]
    0x10000049c <+60>:  add    w8, w8, w9
    0x1000004a0 <+64>:  ldr    w9, [sp, #0x1c]
    0x1000004a4 <+68>:  add    w8, w8, w9
    0x1000004a8 <+72>:  ldr    w9, [sp, #0x18]
    0x1000004ac <+76>:  add    w8, w8, w9
    0x1000004b0 <+80>:  ldr    w9, [sp, #0x14]
    0x1000004b4 <+84>:  add    w8, w8, w9
    0x1000004b8 <+88>:  ldr    w9, [sp, #0x10]
    0x1000004bc <+92>:  add    w8, w8, w9
    0x1000004c0 <+96>:  str    w8, [sp, #0xc]
    0x1000004c4 <+100>: ldr    w0, [sp, #0xc]
    0x1000004c8 <+104>: add    sp, sp, #0x30
    0x1000004cc <+108>: ret
```

## メモリ確保の話

```text
(高)  0x100000000  [ 誰かが使っている領域 ]
 ^                 [ 誰かが使っている領域 ]
 |    0x00001030   SP -----> [ 呼び出し元の位置 ]  ← 高い
 |                           | (引き算で移動)
 |                           v
(低)  0x00001000   SP -----> [ 新しい位置 ]        ← 低い
```

変数用の領域を確保するため、`sp`（stack pointer）を引き下げ、ここまでスタックを使うと示す。

```asm
sub sp, sp, #0x30
```

`sub`はsubtract（引き算）を表す。
`sub [命令先（Destination Register）], [元データ（Source Register）], [即値（Immediate）]`なので、ここでは`sp = sp - 48（0x30）`と同じ意味だ。
`a`〜`h`と`sum`の9個の`int`は合計36B。スタック領域はABIの整列条件も満たす必要がある。

### なぜ48B確保するのか

**Q.** `#0x30`（48B）確保したのに36Bしか使っていない?

**A.** AAPCS64では、スタックポインタ`sp`を16バイト境界に保つ。
この例では、36Bのローカル領域を16の倍数に切り上げ、48B（36Bのデータ＋12Bの余白）を確保する。48BはARM64の一般則ではなく、このコンパイル例のフレーム配置による。
なお、AArch64の非整列アクセスがすべてAlignment Faultになるわけではない。`sp`の整列条件とスタックフレームのサイズを混同しないことがポイントだ。

## データの書き込み

```asm
str w0,[sp, #0x2c]
str w1,[sp, #0x28]
str w2,[sp, #0x24]
...
```

`str`はstore（書き込み）を表す。
`str [元データとなるレジスタ（Source Register）], [書き込み先]`で、書き込み先にはアドレッシングモードを使う。
`[基準となるアドレス（Base Register）, 基準からの距離（Immediate Offset）]`の形式だ。

`str w0, [sp, #0x2c]`なら、`sp + 0x2c（44）`のアドレスに`w0`の32ビット（4B）を保存する。`int`が4Bなので、オフセットも4ずつ移動する。

## データの読み込み

`w0`〜`w7`をスタックに書き込んだら、次に計算する。

```asm
ldr w8, [sp, #0x2c]
ldr w9, [sp, #0x28]
```

`ldr`はLoad（読み込み）で、`str`の逆だ。
`ldr [書き込み先のレジスタ（Destination Register）], [読み込み元]`の形式だ。読み込みにもベースとオフセットを使う。

## 計算する

```asm
add w8, w8, w9
```

`add`は足し算だ。
`add [演算結果の格納先レジスタ（Destination Register）], [加える値のレジスタ1（First Source Register）], [加える値のレジスタ2（Second Source Register）]`の形式だ。
`w8 = w8 + w9`と同じなので、以降は`w9`に`sp`から値をロードし、`w8`に加える作業が続く。

## 返り値

AArch64では、32ビット整数の返り値を`w0`（64ビット値なら`x0`）で返す。計算後、`str w8, [sp, #0xc]`で`sum`に移し、`ldr w0, [sp, #0xc]`で`w0`に戻す。
`add sp, sp, #0x30`でスタック領域を解放し、`ret`で呼び出し元へ戻る。`w0`の値が返り値になる。

### 参考資料

- [Procedure Call Standard for the Arm 64-bit Architecture（AAPCS64）](https://github.com/ARM-software/abi-aa/blob/main/aapcs64/aapcs64.rst)
