---
title: "General Skills in CTF's 2"
pubDate: 2026-08-21
description: ""
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---
# General Skills in CTF's 2

## problem set1

### nice netcat...

Q.ncを使ってお話ししてくれるプログラムに接続しよう、英語じゃないけどね

ASCIIと思われるものが帰ってきた
解釈して以下の通り

picoCTF{g00d_k1tty!_n1c3_k1tty!_a94e7}

### Tab,Tab,Attack

Q.TAB保管を利用してflagを手に入れて

zipをダウンロードunzipから、tabでスパスパ
最終的に実行ファイルとcのプログラムが
実行ファイルはなぜか動かなかったのでcのソースを確認

picoCTF{l3v3l_up!_t4k3_4_r35t!_fc588427}

### Python Wrangling

Q.スクリプトを使ってflagを入手して

catしてみると上の方にusageを出力するものがある
cryptographyが足りないエラーが出た
追加して走らせると

Usage: ende.py (-e/-d) [file]
-e -dはencode decodeのことと予想してdecodeしてみる

$ uv run ende.py -d flag.txt.en
password.txtより
Please enter the password:720b6ad346f84cd483c60c7464dd95d4

picoCTF{4p0110_1n_7h3_h0us3_9c5f9bcf}

### Magikarp Ground Mission

Q.SSHで接続してflagを探して

$ ssh -p port ctf-player@hostname
instanceを起動して発行されたhostnameとportでin
instructionを読んで探し回る

$ cat 3of3.flag.txt
0b24fc4f}

$ cat 2of3.flag.txt
0ut_0f_//4t3r_

$ cat 1of3.flag.txt
picoCTF{xxsh_

合わせて

picoCTF{xxsh_0ut_0f_//4t3r_0b24fc4f}



