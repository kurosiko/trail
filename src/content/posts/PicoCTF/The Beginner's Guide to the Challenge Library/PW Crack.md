---
title: "PW Crack 1〜5"
pubDate: 2026-08-24
description: "picoCTFのPW Crack 1〜5を解いた記録"
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

ASCIIになったのでデコードする。

```console
Please enter correct password for flag: de76
Welcome back... your flag, user:
picoCTF{tr45h_51ng1ng_489dea9a}
```

**Flag:** `picoCTF{tr45h_51ng1ng_489dea9a}`

### PW Crack 3

ここではハッシュが登場する。バイナリファイルの中身を確認するため、
`strings`や`bvi`を試したが、パスワードの手がかりは見つからなかった。
`bvi`はバイナリエディター。バイナリを文字化けさせずに確認するためのヒントだ。

パスワードの候補は`pos_pw_list`にまとまっているため、候補を順番に検証する。

```python

import hashlib

### THIS FUNCTION WILL NOT HELP YOU FIND THE FLAG --LT ########################
def str_xor(secret, key):
    #extend key to secret length
    new_key = key
    i = 0
    while len(new_key) < len(secret):
        new_key = new_key + key[i]
        i = (i + 1) % len(key)
    return "".join([chr(ord(secret_c) ^ ord(new_key_c)) for (secret_c,new_key_c) in zip(secret,new_key)])
###############################################################################

flag_enc = open('level3.flag.txt.enc', 'rb').read()
correct_pw_hash = open('level3.hash.bin', 'rb').read()


def hash_pw(pw_str):
    pw_bytes = bytearray()
    pw_bytes.extend(pw_str.encode())
    m = hashlib.md5()
    m.update(pw_bytes)
    return m.digest()


def level_3_pw_check(password):
    user_pw = password
#    user_pw = input("Please enter correct password for flag: ")
    user_pw_hash = hash_pw(user_pw)

    if( user_pw_hash == correct_pw_hash ):
        print("Welcome back... your flag, user:")
        decryption = str_xor(flag_enc.decode(), user_pw)
        print(decryption)
        return
    print("That password is incorrect")


pos_pw_list = ["f09e", "4dcf", "87ab", "dba8", "752e", "3961", "f159"]
for i in pos_pw_list:
    level_3_pw_check(i)


# The strings below are 7 possibilities for the correct password.
#
```
候補を順番に検証するように書き換えて実行する。

```console
$ uv run level3_solve.py
That password is incorrect
That password is incorrect
Welcome back... your flag, user:
picoCTF{m45h_fl1ng1ng_cd6ed2eb}
That password is incorrect
That password is incorrect
That password is incorrect
That password is incorrect
```

### PW Crack 4

PW Crack 3の候補が100個になっただけで、検証方法は同じ。
ログを確認せず、`grep`でflagだけを取り出す。

```console
$ uv run level4_solve.py | grep -o "picoCTF{.*}"
picoCTF{fl45h_5pr1ng1ng_ae0fb77c}
```

**Flag:** `picoCTF{fl45h_5pr1ng1ng_ae0fb77c}`

### PW Crack 5

パスワードの候補が`dictionary.txt`にある。

```console
$ cat dictionary.txt | head

0000
0001
0002
0003
0004
0005
0006
0007
0008
0009
```
`read()`で一度に読み込むこともできるが、ここでは`readline()`で1行ずつEOFまで読み込む。
次の処理を追記する。

```python
with open("dictionary.txt", "r") as f:
    while True:
        pw = f.readline()
        if not pw:
            break
        level_5_pw_check(pw.strip("\n"))
```

改行文字までハッシュの対象にならないよう、`strip("\n")`で取り除く。

```console
picoCTF{h45h_sl1ng1ng_40f26f81}
```

**Flag:** `picoCTF{h45h_sl1ng1ng_40f26f81}`

以上でPW Crackは終了。お疲れ。
