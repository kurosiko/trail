---
title: "SDLのSurfaceとポインタ配列の寿命を分ける"
pubDate: 2026-11-24
description: "画像を読み込む領域と、画像への参照を保持する領域を追う。"
author: "kurosiko"
tags: ["c","sdl","memory"]
---

## 背景と仕組み

固定数の画像を扱うとき、ポインタを並べる配列と画像本体の確保が混同しやすい。固定長の配列には、`SDL_LoadBMP` が返したSurfaceへのポインタを格納できる。`memset` はすでにある領域へ書き込む操作なので、ポインタ配列の初期化には `{0}` でnullポインタを設定できる。

SDL 2では読み込み失敗時にnullが返る。読み込みに成功したSurfaceは使い終えた時点で `SDL_FreeSurface` で解放する。配列を初期化し直しても以前のSurfaceは解放されない。複数枚を順に読む場合は、途中で失敗したときに読み込み済み分を片付ける。コードは1枚の場合の説明例。

```c
int use_image(void) {
    SDL_Surface *images[2] = {0};
    images[0] = SDL_LoadBMP("sprite.bmp");
    if (!images[0]) return -1;

    /* images[0] を使う処理 */
    SDL_FreeSurface(images[0]);
    return 0;
}
```

## 参照関係

```text
ポインタ配列の要素       SDLが生成したオブジェクト
images[0] ──────────────> Surface
images[1] = NULL
```

参照関係の概念図。

## 環境と確認状況

C、SDLを使うUFOゲーム。C規格・コンパイラ・当時のSDLの版は未確認。コード例はSDL 2向け。

現在のUFOゲームのビルド設定はSDL 2を使用する。`ufo.c` では `SDL_LoadBMP` で画像を読み、`ImageFree` でボス画像の各Surfaceを解放して配列要素を `NULL` に戻す。コード上の確認であり、今回の実機動作は未確認。

## 参照元

- [SDL 2のSDL_LoadBMP](https://wiki.libsdl.org/SDL2/SDL_LoadBMP)

- [SDL 2のSDL_FreeSurface](https://wiki.libsdl.org/SDL2/SDL_FreeSurface)
