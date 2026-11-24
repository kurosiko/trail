---
title: "robots.txtのクロール制御"
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
ヒントから`robots.txt`を確認する。

```text
User-agent: *
Disallow: /cc6b1.html
```

演習ではこのパスにflagがあった。`Disallow` は対象のクローラーに取得を控えるよう伝える指示。公開ファイルに対するアクセス制御は別途必要になる。

**Flag:** `picoCTF{ca1cu1at1ng_Mach1n3s_cc6b1}`

- [RFC 9309 Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
