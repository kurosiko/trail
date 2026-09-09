---
title: "General Skills in CTF's 1"
pubDate: 2026-08-21
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
## Problem set 1

### Let's warm up

> **Q.** 0x70はASCIIで何か?

```text
7 * 16 = 112
で112は小文字のp
```

**Flag:** `picoCTF{p}`

### 2warm

> **Q.** 42をバイナリ(0と1)に変換して

```text
101010
となる
```

**Flag:** `picoCTF{101010}`

### Warmed up

> **Q.** 0x3Dを10進数へ
>
> **A.** 61

```text
3 * 16 = 48
D * 1  = 13
```

**Flag:** `picoCTF{61}`

## Problem set 2

### Obedient Cat

> **Q.** flagが平文でおいてあるから

**Flag:** `picoctf{s4n1ty_v3r1f13d_9b8fa0bc}`

### Wave a flag

> **Q.** flagを探せ

ctrl+fでpicoCTFを検索すればよい。

**Flag:** `picoCTF{b1scu1ts_4nd_gr4vy_ac5832c}`

### convertme.py

> **Q.** スクリプトを走らせて10進数から2進数にしてflagを取得して

普通に走らせるだけ。
72をバイナリに変換し、`1001010`を返す。

**Flag:** `picoCTF{4ll_y0ur_b4535_9c3b7d4d}`

### What's a net cat?

> **Q.** ncを使って特定のポートにアクセスしてflagを取得して

インスタンスを起動し、nc tutorialで確認する。
`nc -arg hostname port`らしいので接続。

**Flag:** `picoCTF{nEtCat_Mast3ry_0d33dA2C}`
