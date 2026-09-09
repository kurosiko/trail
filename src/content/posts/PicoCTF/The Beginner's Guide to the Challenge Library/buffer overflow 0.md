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

なんかバイナリファイルと`vuln.c`が与えられている
インスタンスもあるけど、なんだこれ

どうやらサーバーに`flag.txt`
buf1で受け取った文字列をbuf2にコピーする際にエラーを起こしている
16文字しかbuf2は受け取れないので16文字以上を入力してみたら
普通にflagが取れてしまった

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

`signal`でエラーハンドラーを登録していた
エラーを起こしたときにflag.txtの中身を出すだけのコードだった。
