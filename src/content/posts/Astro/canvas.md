---
title: "背景の星空をCanvasで描画する"
pubDate: 2026-07-30
description: "このページの背景の星空の作り方(Preact)"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["trail", "web", "frontend"]
---

```tsx
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const frameId:number;
const animate = ()=>{
  //以下描画勝利
  ctx.clearReact(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
  ctx.shadowBlur = star.size > 1.2 ? 4 : 0;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.fill();
  //callbackでまた呼出し
  frameId = requestAnimationFrame(animate);
}
//初回の呼出し
requestAnimationFrame(animate)

//ページを離れるときに
cancelAnimationFrame(frameId);
```
