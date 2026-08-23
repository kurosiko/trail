---
title: "where are the robots"
pubDate: 2026-08-23
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
> **Q.** ロボットを見つけられるかな?

ソースを見てもそれらしきものは見つからない。
CSSにコメントアウトと謎のflag指定はあるが、肝心の要素がない。

ヒントを見ると「作成者があなたに見られたくないところはどこか?」とある。
ここで分からないのでカンニング。robot.txtのことらしい。
今回は私はrobotだったのか...

```text
User-agent: *
Disallow: /cc6b1.html
```

とあるのでアクセスしてflagを取得。

**Flag:** `picoCTF{ca1cu1at1ng_Mach1n3s_cc6b1}`
