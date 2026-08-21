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
# General Skills in CTF's 1

## problem set1

### lets warm up

Q.0x70はASCIIで何か?
7 * 16 = 112
で112は小文字のp
picoCTF{p}

### 2warm

Q.42をバイナリ(0と1)に変換して
101010
となる
picoCTF{101010}

### warmed up

Q.0x3Dを10進数へ
A.61
3*16 = 48
D*1  = 13
picoCTF{61}

## problem set2

### Obdient Cat

Q.flagが平文でおいてあるから
picoctf{s4n1ty_v3r1f13d_9b8fa0bc}

### Wave a flag

Q.flagを探せ
ctrl+fでpicoCTFに検索をかければ早い
picoCTF{b1scu1ts_4nd_gr4vy_ac5832c}

### convertme.py

Q.スクリプトを走らせて10進数から2進数にしてflagを取得して
普通に走らせるだけ
72を得たのでそれのバイナリにして1001010を返却
picoCTF{4ll_y0ur_b4535_9c3b7d4d}

### What's a net cat?

Q.ncを使って特定のポートにアクセスしてflagを取得して
インスタンスを立ち上げ
nc tutorialで見てみる
nc -arg hostname portらしいので接続
picoCTF{nEtCat_Mast3ry_0d33dA2C}


