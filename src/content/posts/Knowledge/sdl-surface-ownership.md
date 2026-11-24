---
title: "SDL Surfaceとポインタ配列の寿命"
pubDate: 2026-11-24
description: "画像を読み込む領域と、画像への参照を保持する領域を追う。"
author: "kurosiko"
tags: ["c","sdl","memory"]
---

## 背景と仕組み

固定数の画像を扱うとき、ポインタを並べる配列と画像本体の確保が混同しやすい。固定長の配列には、`SDL_LoadBMP` が返したSurfaceへのポインタを格納できる。`memset` はすでにある領域へ書き込む操作なので、ポインタ配列の初期化には `{0}` でnullポインタを設定できる。

SDL 2では読み込み失敗時にnullが返る。読み込みに成功したSurfaceは使い終えた時点で `SDL_FreeSurface` で解放する。配列を初期化し直しても以前のSurfaceは解放されない。複数枚を順に読む場合は、途中で失敗したときに読み込み済み分を片付ける。コードは1枚の場合の説明例。

```c
#include <SDL.h>

int use_image(void) {
    SDL_Surface *images[2] = {0};
    images[0] = SDL_LoadBMP("sprite.bmp");
    if (!images[0]) return -1;

    /* images[0] を使う処理 */
    SDL_FreeSurface(images[0]);
    images[0] = NULL;
    return 0;
}
```

### 配列とSurfaceの寿命は別々に終わる

<figure class="post-diagram">
<svg viewBox="0 0 340 131" role="img" aria-labelledby="surface-ref-title surface-ref-desc">
<title id="surface-ref-title">ポインタ配列と確保されたSurface</title>
<desc id="surface-ref-desc">imagesの要素0は動的に確保されたSurfaceを指し、要素1はNULLを保持する。</desc>
<rect x="14" y="15" width="147" height="102" rx="7"/>
<rect x="211" y="49" width="115" height="52" rx="7"/>
<path d="M14 47H161 M14 82H161"/>
<text x="26" y="36">images（自動）</text><text x="26" y="70">[0]　ポインタ</text>
<text x="26" y="104">[1]　NULL</text><text x="224" y="80">Surface（動的）</text>
<path class="diagram-arrow" d="M161 68h50m-7-4 7 4-7 4"/>
</svg>
<figcaption>読み込み成功後の参照関係。配列には画像本体を格納しない。</figcaption>
</figure>

| 時点 | ローカル配列 `images` | 読み込んだSurface |
| --- | --- | --- |
| `SDL_LoadBMP` 成功 | 要素0に参照を格納 | 生存中 |
| `SDL_FreeSurface` の直後 | 配列は生存。要素0の旧参照は無効 | 寿命が終了 |
| `images[0] = NULL` の直後 | 要素0にnullを代入 | 解放済み |
| 関数から戻った後 | 自動記憶域期間が終了 | 解放済み |

解放後に残った旧参照はダングリングポインタ。SDLが配列要素を自動で `NULL` に書き換えるわけではない。Cでは参照先の寿命が終わったポインタ値は不定値になる。旧値を比較や逆参照に使わず、再利用する変数には明示的に `NULL` などを代入する。他の変数にコピーした参照も同時に無効になる。

逆に、`SDL_FreeSurface` を呼ばずに関数を抜けても、動的に確保したSurfaceは残る。別の場所へ所有権を渡していなければ、解放に必要な参照を失いメモリリークになる。SDL 3へ移植する場合は解放関数を `SDL_DestroySurface` に替える。

## 環境と確認状況

C、SDLを使うUFOゲーム。C規格・コンパイラ・当時のSDLの版は未確認。コード例はSDL 2向け。

現在のUFOゲームのビルド設定はSDL 2を使用する。`ufo.c` では `SDL_LoadBMP` で画像を読み、`ImageFree` でボス画像の各Surfaceを解放して配列要素を `NULL` に戻す。掲載コードではSDL 2.32.74を使い、テスト用BMPを読み込める場合とファイルがない場合の戻り値を確認した。UFOゲームの画面表示は未確認。

## 参照元

- [SDL 2のSDL_LoadBMP](https://wiki.libsdl.org/SDL2/SDL_LoadBMP)

- [SDL 2のSDL_FreeSurface](https://wiki.libsdl.org/SDL2/SDL_FreeSurface)

- [SDL 3のSDL_DestroySurface](https://wiki.libsdl.org/SDL3/SDL_DestroySurface)
- [WG14 N1570 §6.2.4 Storage durations of objects](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
