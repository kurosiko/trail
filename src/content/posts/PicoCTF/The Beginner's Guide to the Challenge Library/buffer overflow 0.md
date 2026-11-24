---
title: "C言語のバッファオーバーフロー"
pubDate: 2026-08-30
description: "バッファオーバーフローでflagを取得する問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

> **Q.** シンプルにいきましょう。正しいバッファをオーバーフローさせてください。

バイナリファイル、`vuln.c`、実行用インスタンスが用意されている。
`buf1`で受け取った文字列を、16バイト分の`buf2`へコピーするときにオーバーフローが発生する。
書き込み範囲を越えた時点でCでは未定義動作になる。以下は、この演習の実行記録で得た結果。

**Flag:** `picoCTF{ov3rfl0ws_ar3nt_that_bad_ef01832d}`

補足:

```c
// vuln.c

void sigsegv_handler(int sig){
    printf("%s\n", flag);
    fflush(stdout);
    exit(1);
}

/* main内での登録 */
signal(SIGSEGV, sigsegv_handler);

```

演習のハンドラーは `SIGSEGV` を受けると、読み込み済みの `flag` を出力する。範囲外書き込みが毎回 `SIGSEGV` になる保証はない。このハンドラーの標準入出力や `exit` は、非同期シグナルに対する汎用のエラー処理には使えない。
