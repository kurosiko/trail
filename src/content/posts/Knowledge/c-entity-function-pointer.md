---
title: "Cの関数ポインタにEntity自身を渡す"
pubDate: 2026-11-24
description: "Entityごとに移動処理を差し替え、selfで更新対象を指定する。"
author: "kurosiko"
tags: ["c","sdl","game-dev"]
---

## 背景と設計

Entityごとに別の移動処理を呼び出し、その処理から座標を書き換えたい。Cの関数ポインタは呼び出す関数を指す。どのEntityを更新するかは呼び出し側が引数で指定する。以前の実装の詳細は未確認。

検討した形は、Entityに移動関数のポインタを持たせ、呼び出し時に `self` を明示的に渡すもの。共通の呼び出し方で、Entityごとに別の関数を使える。コードは説明用。関数ポインタは呼び出す前に初期化し、`self` は呼び出し中に有効なEntityを指すようにする。移動処理が共通なら通常の関数でも足りる。

```c
typedef struct Entity {
    float x, y;
    void (*movement)(struct Entity *self);
} Entity;

static void move_right(Entity *self) {
    self->x += 1.0f;
}

void example(void) {
    Entity e = {0.0f, 0.0f, move_right};
    e.movement(&e);
}
```

## 概念図

```mermaid
flowchart LR
  E[Entity: x, y, movement] -->|関数ポインタ| F[move_right]
  F -->|self が指す Entity を更新| E
```

## 環境と確認状況

C、SDLを使うUFOゲーム。C規格・コンパイラ・SDLの版は未確認。

現在のUFOゲームのソースでは、`game.c` がUFOごとに移動関数を割り当て、`ufo->movement(ufo)` で呼ぶ。上の説明例とは型名が異なる。説明例はApple Clang 21.0.0でC17としてコンパイルし、座標が更新されることを確認した。ゲーム画面上の動作は未確認。
