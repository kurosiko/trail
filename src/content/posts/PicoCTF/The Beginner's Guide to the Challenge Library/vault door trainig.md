---
title: "vault-door-trainig"
pubDate: 2026-08-26
description: "Javaのソースコードからパスワードを求める問題の記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# vault-door-trainig

> **Q.** blueprintsを探して、ただしパスワードが必要なのでソースコードから割り出してね

Javaファイルを、`JDK`でコンパイルして実行する。

```console
$ javac VaultDoorTrainig.java
$ java VaultDoorTrainig
```

下部にパスワードがそのまま記載されている。

```java
String input = userInput.substring(...)
```

`userInput`から`picoCTF{...}`の中身だけを検証している。
パスワードを`picoCTF{}`で囲めばflagになる。


**Flag:** `picoCTF{w4rm1ng_Up_w1tH_jAv4_000iPnsaWOY}`
