---
title: "C言語の構造体と関数ポインタ"
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

式 `e.movement(&e)` では、`e.movement` が呼び出し先、`&e` が第一引数の値になる。呼び出された `move_right` は仮引数 `self` を通して `e.x` を書き換える。Cは構造体のメンバー経由で関数を呼んでも、構造体自身のアドレスを自動では渡さない。C++の非staticメンバー関数内で使える `this` や、Rustで `e.method()` と書くとレシーバーに対応付けられる `self` とは、呼び出し方が異なる。

<figure class="post-diagram">
<svg viewBox="0 0 340 211" role="img" aria-labelledby="entity-call-title entity-call-desc">
<title id="entity-call-title">関数ポインタとselfの参照先</title>
<desc id="entity-call-desc">Entityのmovementフィールドからmove_right関数へ。呼び出し時のself引数からはEntityのデータへ矢印を引く。</desc>
<rect x="16" y="22" width="137" height="74" rx="7"/>
<rect x="188" y="120" width="136" height="72" rx="7"/>
<path d="M16 55H153 M188 152H324"/>
<text x="28" y="44">Entity e</text><text x="28" y="81">x, y　movement</text>
<text x="200" y="143">move_right</text><text x="200" y="177">self = &amp;e</text>
<path class="diagram-arrow" d="M135 84v26h118v10m-4-6 4 6 4-6"/>
<path class="diagram-arrow" d="M188 172H69V96m-4 6 4-6 4 6"/>
<text x="149" y="101">関数</text><text x="83" y="163">Entity参照</text>
</svg>
<figcaption>関数ポインタの参照先と、呼び出し時に渡される引数の参照先。</figcaption>
</figure>

## 環境と確認状況

C、SDLを使うUFOゲーム。C規格・コンパイラ・SDLの版は未確認。

現在のUFOゲームのソースでは、`game.c` がUFOごとに移動関数を割り当て、`ufo->movement(ufo)` で呼ぶ。上の説明例とは型名が異なる。説明例はApple Clang 21.0.0でC17としてコンパイルし、座標が更新されることを確認した。ゲーム画面上の動作は未確認。

- [WG14 N1570 §6.5.2.2 Function calls](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
