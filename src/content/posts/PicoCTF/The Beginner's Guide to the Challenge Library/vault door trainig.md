---
title: "Javaの文字列切り出しとパスワード検証"
pubDate: 2026-08-26
description: "Javaのソースコードからパスワードを求める問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

> **Q.** blueprintsを探して、ただしパスワードが必要なのでソースコードから割り出してね

Javaファイルを、`JDK`でコンパイルして実行する。

```console
$ javac VaultDoorTraining.java
$ java VaultDoorTraining
```

下部にパスワードがそのまま記載されている。

```java
String input = userInput.substring("picoCTF{".length(), userInput.length() - 1);
```

演習コードは `substring` で接頭辞相当の長さと最後の1文字を除き、切り出した部分を比較する。この切り出し処理自体は接頭辞や閉じ括弧を検査しない。入力が短すぎる場合は、比較する前に `substring` が例外を投げる。
パスワードを`picoCTF{}`で囲めばflagになる。


**Flag:** `picoCTF{w4rm1ng_Up_w1tH_jAv4_000iPnsaWOY}`
