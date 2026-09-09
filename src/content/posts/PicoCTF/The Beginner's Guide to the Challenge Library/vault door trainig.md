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

Javaファイルが渡されている。
jdk入れるのめんどいなぁとか思いながら...
Javaは触ったことがないのでよく分からない。
```
$ javac VaultDoorTrainig.java
$ java VaultDoorTrainig
```
で動いた。
下の方にパスワードがそのまま置いてある。これでよさそうだ。
尚且つ
```java
String input = userInput.substring(...)

```
とあり、userInputからpicoCTF{...}の中身だけを検証しているようだ。
flagはパスワードにpicoCTF{}を付けたものだ。


**Flag:** `picoCTF{w4rm1ng_Up_w1tH_jAv4_000iPnsaWOY}`
