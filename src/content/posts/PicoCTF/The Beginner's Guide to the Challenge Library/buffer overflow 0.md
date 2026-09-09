---
title: "buffer overflow 0"
pubDate: 2026-08-30
description: "バッファオーバーフローでflagを取得する問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# buffer overflow 0

> **Q.** シンプルにいきましょう。正しいバッファをオーバーフローさせてください。

バイナリファイル、`vuln.c`、実行用インスタンスが用意されている。
`buf1`で受け取った文字列を、16文字分の`buf2`へコピーするときにオーバーフローが発生する。
長い文字列を入力してエラーを起こすと、flagを取得できる。

**Flag:** `picoCTF{ov3rfl0ws_ar3nt_that_bad_ef01832d}`

補足:

```c
// vuln.c

void sigsegv_hander(int sig){
    printf("%s\n", flag);
    fflush(stdout);
    exit(1);
}

signal(SIGSEGV, sigsev_handler);

```

`signal`でエラーハンドラーを登録している。
エラーが発生すると、`flag.txt`の内容を出力する。
