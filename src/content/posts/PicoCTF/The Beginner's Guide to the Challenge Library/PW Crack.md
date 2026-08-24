---
title: "PW Crack 1〜3"
pubDate: 2026-08-24
description: "picoCTFのPW Crack 1〜3を解いた記録"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

## PW Crack

> **Q.** パスワードをクラックしてflagを入手して
>
> `levelX.py`と`levelX.flag.txt.enc`を受け取って、そこからflagを入手する。

### PW Crack 1

`level1.py`

```python
def level_1_pw_check():
    user_pw = input("Please enter correct password for flag: ")
    if user_pw == "8713":
        print("Welcome back... your flag, user:")
        decryption = str_xor(flag_enc.decode(), user_pw)
        print(decryption)
        return
    print("That password is incorrect")
```

`user_pw == "8713"`とあるので、8713を入力する。

```console
Please enter correct password for flag: 8713
Welcome back... your flag, user:
picoCTF{545h_r1ng1ng_1b2fd683}
```

**Flag:** `picoCTF{545h_r1ng1ng_1b2fd683}`

### PW Crack 2

`level2.py`

```python
def level_2_pw_check():
    user_pw = input("Please enter correct password for flag: ")
    if user_pw == chr(0x64) + chr(0x65) + chr(0x37) + chr(0x36):
        print("Welcome back... your flag, user:")
        decryption = str_xor(flag_enc.decode(), user_pw)
        print(decryption)
        return
    print("That password is incorrect")
```

ASCIIになっただけなので、これをデコードしてあげる。

```console
Please enter correct password for flag: de76
Welcome back... your flag, user:
picoCTF{tr45h_51ng1ng_489dea9a}
```

**Flag:** `picoCTF{tr45h_51ng1ng_489dea9a}`

### PW Crack 3

ここでHashの話が加わった。
