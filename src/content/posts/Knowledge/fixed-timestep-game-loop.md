---
title: "描画頻度が変わってもゲームの更新間隔を固定する"
pubDate: 2026-11-24
description: "毎フレームの移動量が描画頻度に依存する理由を、時間を蓄積する固定タイムステップの例で確かめる。"
author: "kurosiko"
tags: ["game-dev", "javascript", "animation"]
draft: true
---

毎フレーム位置に5を足す処理は、1秒に60回呼ばれると300、30回なら150進む。描画頻度で移動速度が変わるのは、更新に使う単位が「秒」ではなく「呼び出し1回」だからだ。この性質はUFOゲームの弾を進めるコードや、[Trailの星空](/posts/astro/canvas)の透明度更新にも見られる。以下では更新と描画を分ける方法を、独立した説明例で扱う。

## 経過時間を一定間隔の更新に変換する

単純な見た目のアニメーションであれば、前回からの経過時間を移動速度に掛ける方法で足りる。衝突判定のように更新の間隔も揃えたい処理では、経過時間を貯め、一定量に達するごとに同じ時間幅で更新する方法がある。

```js
const stepMs = 20;
let remainingMs = 0;
let x = 0;

function advance(elapsedMs) {
  remainingMs += Math.min(elapsedMs, 100);
  while (remainingMs >= stepMs) {
    x += 100 * (stepMs / 1000); // 100 px/s
    remainingMs -= stepMs;
  }
}
```

`requestAnimationFrame` のコールバックでは、受け取った時刻と前回の時刻の差を `advance` に渡し、その後で1回描画する。例えば最初の16 msでは更新が0回、さらに28 msが経つと合計44 msのうち40 msを使って2回更新し、4 msを次回に残す。

この例は長い停止のあとに大量の更新を実行しないよう、1回に受け入れる時間を100 msに制限する。上限を超えた分はシミュレーションの時間から落ちるので、実時間に追いつく必要があるゲームでは別途扱いを決める。描画を滑らかにしたい場合は、前回と最新の確定位置の間を、残り時間に応じて補間できる。

## 説明例の検証

Bun 1.3.13で、16 msと28 msの2回で進めた場合と、44 msを一度に渡した場合がともに位置4 px、残り4 msになることを確認した。1000 msを一度に渡したときは、100 ms分の5回だけ更新した。これは説明例の検証結果で、ゲーム本体にこの方式を導入した記録ではない。

- [HTML StandardのAnimation frames](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames)
