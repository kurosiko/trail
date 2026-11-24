---
title: "Pythonのインデントと比較式の構文"
pubDate: 2026-08-25
description: "Pythonの構文エラーを修正してflagを取得する問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

> **Q.** Pythonの構文エラーを直して、flagを取得しよう

## Problem set1

### fixme1.py

ブロック内のインデントを揃えて実行する。Pythonではインデントが文の所属するブロックを決める。

**Flag:** `picoCTF{1nd3nt1ty_cr1515_09ee727a}`

### fixme2.py

条件式で等しいかを比較するため、`=` を `==` に直す。`=` は代入文に使う。

**Flag:** `picoCTF{3qu4l1ty_n0t_4551gnm3nt_4863e11b}`
