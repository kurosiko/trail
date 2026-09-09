---
title: "keygenme-py"
pubDate: 2026-08-26
description: "Pythonプログラムを解析してライセンスキーを求める問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# keygenme-py

**もはや問題文すらない**

プログラムを実行する。

```
Arcane Calculatorへようこそ、BENNETT
これはArcane Calculatorの体験版です
完全版は天の川銀河の中心付近でお買い求めいただけます
数に限りがあるので、お早めにどうぞ！

Arcane Calculator
メニュー
(a) Astral Projectionのマナ消費量を推測する
(b) [制限中] Astral Slingshotの接近軌道を推測する
(c) ライセンスキーの入力をする
(d) 終了する

どうしますかBENNET?(a/b/c/d)
```
このようなプログラムだ。
LOLやArcaneのパロディだが、ここでは扱わない。


目標は`key_full_template_trail`の取得だ。
`key_part_dynamic1_trail`を求めればよい。

`check_key`は入力と`key_full_template_trail`の文字数が異なると受け付けないため、`key_part_dynamic1_trail`は8文字になる。

`username_trail`をSHA-256でハッシュ化し、16進数の各インデックスを確認する。

```python
import hashlib
username_trial = "BENNETT"
key_part_static1_trial = "picoCTF{1n_7h3_kk3y_of_"
key_part_dynamic1_trial = "xxxxxxxx"
# key dynamic have 8 length
key_part_static2_trial = "}"
hashed = hashlib.sha256(username_trial.encode('utf-8')).hexdigest()
print(hashed[1:9])
# a6c084a4

# 08c46aa4 is dynamic1

key_part_dynamic1_trial = "08c46aa4"

key = key_part_static1_trial + key_part_dynamic1_trial + key_part_static2_trial

print(key)
```


**Flag:** `picoCTF{1n_7h3_kk3y_of_08c46aa4}`
