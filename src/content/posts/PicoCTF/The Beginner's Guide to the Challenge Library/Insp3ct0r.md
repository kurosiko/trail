---
title: "Insp3ct0r"
pubDate: 2026-08-23
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
> **Q.** Kishor Balanが、次のコードは確認する必要がありそうとひっそり教えてくれた。

instanceを立ち上げるとwebページのリンクが表示される。
開発者ツールで覗いてみると、とりあえず以下のものを発見。

```html
<!-- Html is neat. Anyways have 1/3 of the flag: picoCTF{tru3_d3 -->
```

見当たらないのでheadタグを見ると、CSSとJavaScriptがロードされている。

```css
/* You need CSS to make pretty pages. Here's part 2/3 of the flag: t3ct1ve_0r_ju5t */
```

```javascript
/* Javascript sure is neat. Anyways part 3/3 of the flag: _lucky?302945a7} */
```

合わせて、flagは以下の通り。

**Flag:** `picoCTF{tru3_d3t3ct1ve_0r_ju5t_lucky?302945a7}`
