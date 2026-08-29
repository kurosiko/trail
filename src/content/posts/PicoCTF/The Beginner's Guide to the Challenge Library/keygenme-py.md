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

とりあえず動かしてみる

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
といった具合だろうか
LOLとかArcaneのパロディらしいが、私は分からないので特に触れることができない...


目標としては
key_full_template_trailを取得することである
key_part_dynamic1_trailを持ってこれば大丈夫みたい

check_keyで入力とkey_full_template_trailの文字数が同じで無いので受け付けないのでkey_part_dynamic1_trailは8文字で確定

username_trailをsha256にかけたものを16進数に変換してそこからindex一つ一つ確認していくだけ

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
