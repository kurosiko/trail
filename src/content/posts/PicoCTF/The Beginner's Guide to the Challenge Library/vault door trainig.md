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

javaファイルが渡されてますね
jdk入れるのめんどいなぁとか思いながら...
java触ったこのないのでよくわからないんですけど
```
$ javac VaultDoorTrainig.java
$ java VaultDoorTrainig
```
で動きました
下の方にパスワードが生で置いてあるのでそれでいいでしょう
尚且つ
```java
String input = userInput.substring(...)

```
とか書いてあってuserInputからpicoCTF{...}の中身だけを検証しているみたいですね
なのでflagはパスワードにpicoCTF{}をつけたもので良さそうです


**Flag:** `picoCTF{w4rm1ng_Up_w1tH_jAv4_000iPnsaWOY}`
