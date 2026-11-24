---
title: "背景の星空をCanvasで描画する"
pubDate: 2026-07-30
description: "星を毎フレーム描き直し、Preactコンポーネントの終了時にアニメーションを止める。"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["canvas", "preact", "animation", "frontend"]
---

Canvasで星を明滅させるには、星の座標や透明度をJavaScript側に持ち、各フレームで描き直す。Canvasに描いた円はDOM要素として残らないので、前のフレームを `clearRect` で消し、各円のパスを `beginPath` から作り直す。

## フレームの予約と解除

`requestAnimationFrame` は次の描画前のコールバックを1回予約する。ループにするにはコールバック内で次の回を予約する。コンポーネントを外すときは、最後に予約したIDを使って解除する。リサイズのイベントも登録した場合は、同じ後処理で解除する。

Trailの `Starfield.tsx` の処理を、描画部分を省いて示す説明例。

```ts
function startAnimation(draw: () => void) {
  let frameId: number;
  function animate() {
    draw();
    frameId = requestAnimationFrame(animate);
  }
  animate();
  return () => cancelAnimationFrame(frameId);
}
```

TrailではPreactの `useEffect` の終了処理にこの解除を置く。透明度はフレームごとに増減するため、同じ増分でも描画頻度によって明滅の速さは変わる。秒単位で速さを揃えるなら、コールバックの時刻から前回との差を求め、1秒あたりの増分と掛け合わせる。

- [HTML StandardのAnimation frames](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames)
