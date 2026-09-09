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

[Memory](/posts/knowledge/memory)から分けた、ARM64（AArch64、Apple Siliconを含む）のメモです。

ここで説明するのは、AArch64のプロシージャ呼び出し規約（AAPCS64）における、整数・ポインタ引数の基本です。macOSにはAAPCS64を基にしたプラットフォーム固有の規則もありますが、この範囲では共通しています。
第1〜8引数は`x0`〜`x7`（32ビットの値なら`w0`〜`w7`）に渡され、9個目以降は通常スタック側に渡されます。
浮動小数点値やベクトル値は主に`v0`〜`v7`、構造体や可変長引数では別の規則があるので、「ARM64なら必ず8個」とは限りません。

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

macOSでは、Apple Clangを使って最適化をオフ、デバッグ情報をオンにしてコンパイルします。
`gcc`という名前が`clang`への互換名になっている環境もありますが、ここでは`clang`と明示します。

```console
$ clang -g -O0 demo.c -o demo
```

ここではmacOS標準のLLDBを使います。

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

ブレークポイントを置いて`disassemble`を実行し、生成された命令を確認します。Apple SiliconはAArch64なので、x86-64とは異なる命令になります。

以下はApple Silicon向けにコンパイルした一例です。`-O0`のため、引数をいったんスタックへ退避するコードになっています。

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

変数を使うためのメモリ領域を確保するために、`sp`（stack pointer）を引き下げて、ここまでスタックを使いますと示します。

```asm
sub sp, sp, #0x30
```

`sub`はsubtract（引き算）です。
`sub [命令先（Destination Register）], [元データ（Source Register）], [即値（Immediate）]`なので、ここでは`sp = sp - 48（0x30）`と同じような意味です。
`a`〜`h`と`sum`の9個の`int`は合計36Bですが、スタック領域の大きさはABIの整列条件も満たす必要があります。

### なぜ48B確保するのか

Q. `#0x30`（48B）確保したのに36Bしか使っていない?

A. AAPCS64では、スタックポインタ`sp`を16バイト境界に保つよう定めています。
この例では、36Bのローカル領域を16の倍数に切り上げた48B（36Bのデータ＋12Bの余白）になっています。ただし、48BになることはARM64のすべての関数に当てはまる一般則ではなく、このコンパイル例のフレーム配置によるものです。
なお、AArch64のすべての非整列アクセスが必ずAlignment Faultになる、という意味ではありません。ここでは`sp`の整列条件とスタックフレームのサイズを混同しないのがポイントです。

## データの書き込み

```asm
str w0,[sp, #0x2c]
str w1,[sp, #0x28]
str w2,[sp, #0x24]
...
```

`str`はstore（書き込み）です。
`str [元データとなるレジスタ（Source Register）], [書き込み先]`で、書き込み先にはアドレッシングモードを使います。
`[基準となるアドレス（Base Register）, 基準からの距離（Immediate Offset）]`の形式です。

`str w0, [sp, #0x2c]`なら、`sp + 0x2c（44）`のアドレスに、`w0`の32ビット（4B）を保存します。今回は`int`が4Bなので、オフセットも4ずつ移動しています。

## データの読み込み

`w0`〜`w7`を用いてスタックに書き込んだら、次は計算を行います。

```asm
ldr w8, [sp, #0x2c]
ldr w9, [sp, #0x28]
```

`ldr`はLoad（読み込み）で、`str`の逆です。
`ldr [書き込み先のレジスタ（Destination Register）], [読み込み元]`の形式で、読み込みにもベースとオフセットを利用したアドレッシングモードを使います。

## 計算する

```asm
add w8, w8, w9
```

`add`は足し算です。
`add [演算結果の格納先レジスタ（Destination Register）], [加える値のレジスタ1（First Source Register）], [加える値のレジスタ2（Second Source Register）]`の形式です。
`w8 = w8 + w9`と同じなので、以降は`w9`に`sp`から値をロードして`w8`に加える作業が続きます。

## 返り値

AArch64では、32ビット整数の返り値を`w0`（64ビット値なら`x0`）で返します。すべての計算が終わって`w8`に合計値がある場合、`str w8, [sp, #0xc]`で`sum`に移し、`ldr w0, [sp, #0xc]`で`w0`に戻しています。
`add sp, sp, #0x30`でスタック領域を解放し、`ret`で呼び出し元へ戻った時点で`w0`の値が返り値になります。

### 参考資料

- [Procedure Call Standard for the Arm 64-bit Architecture（AAPCS64）](https://github.com/ARM-software/abi-aa/blob/main/aapcs64/aapcs64.rst)
