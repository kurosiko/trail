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
## Problem set 1

### Nice netcat...

> **Q.** ncを使ってお話ししてくれるプログラムに接続しよう、英語じゃないけどね

ASCIIと思われるものが帰ってきた。解釈して以下の通り。

**Flag:** `picoCTF{g00d_k1tty!_n1c3_k1tty!_a94e7}`

### Tab, Tab, Attack

> **Q.** TAB保管を利用してflagを手に入れて

zipをダウンロード、unzipしてからtabでスパスパ。
最終的に実行ファイルとcのプログラムが出てきた。
実行ファイルはなぜか動かなかったので、cのソースを確認。

**Flag:** `picoCTF{l3v3l_up!_t4k3_4_r35t!_fc588427}`

### Python Wrangling

> **Q.** スクリプトを使ってflagを入手して

catしてみると、上の方にusageを出力するものがある。
cryptographyが足りないエラーが出たので、追加して走らせると以下の表示が出る。

```text
Usage: ende.py (-e/-d) [file]
-e -dはencode decodeのことと予想してdecodeしてみる
```

```console
$ uv run ende.py -d flag.txt.en
password.txtより
Please enter the password:720b6ad346f84cd483c60c7464dd95d4
```

**Flag:** `picoCTF{4p0110_1n_7h3_h0us3_9c5f9bcf}`

### Magikarp Ground Mission

> **Q.** SSHで接続してflagを探して

instanceを起動して発行されたhostnameとportでinし、instructionを読んで探し回る。

```console
$ ssh -p port ctf-player@hostname
$ cat 3of3.flag.txt
0b24fc4f}

$ cat 2of3.flag.txt
0ut_0f_//4t3r_

$ cat 1of3.flag.txt
picoCTF{xxsh_
```

**Flag:** `picoCTF{xxsh_0ut_0f_//4t3r_0b24fc4f}`

## Problem set 2

### First Grep

> **Q.** ファイルからflagを探せるかな? 手動でやると面倒だよね

grepを使おう。macOSだと正規表現の-Pオプションが使えなかったので、以下のコマンドを使う。

```console
$ grep "picoCTF{.*}" ./file
```

**Flag:** `picoCTF{grep_is_good_to_find_things_cEDf1591}`

### First Find

> **Q.** zip解凍をして`uber-secret.txt`を探す

findコマンドを使う。

```console
$ unzip files.zip
$ find ./files -name "uber-secret.txt" -exec cat {} +
```

最後の`+`はcatを一回でまとめて実行するものらしい。イメージ的には以下の通り。

```console
$ cat ./a.txt ./b.txt
```

`;`も指定できて、こちらは以下のように実行する。

```console
$ cat ./a.txt
$ cat ./b.txt
```

何はともあれflag発見。

**Flag:** `picoCTF{f1nd_15_f457_ab443fd1}`

### Big Zip

> **Q.** unzipしてflagを探して

階層があるのでgrepを再帰的に検索する。

```console
$ grep -ro "picoCTF{.*}" ./big-zip-files/

./big-zip-files/folder_pmbymkjcya/folder_cawigcwvgv/folder_ltdayfmktr/folder_fnpfclfyee/whzxrpivpqld.txt:picoCTF{gr3p_15_m4g1c_ef8790dc}
```

見つかった。

**Flag:** `picoCTF{gr3p_15_m4g1c_ef8790dc}`

### Static ain't always noise

> **Q.** バイナリをチェックしてくれ、bashスクリプトが助けになるよ!

早速スクリプトを走らせようとするも、権限拒否されたので付与する。

```console
$ ./ltdis.sh
zsh: permission denied: ./ltdis.sh

$ chmod +x ./ltdis.sh
$ ./ltdis.sh

Attempting disassembly of  ...                                                      /Library/Developer/CommandLineTools/usr/bin/objdump: error: 'a.out': No such file or directory                                                                          Disassembly failed!
Usage: ltdis.sh <program-file>
Bye!
```

使い方を示されてしまったので、引数を指定する。

```console
$ ./ltdis.sh ./static

Attempting disassembly of ./static ...
Disassembly successful! Available at: ./static.ltdis.x86_64.txt
Ripping strings from binary with file offsets...                                    Any strings found in ./static have been written to ./static.ltdis.strings.txt with file offset
```

Disassemblyしてくれたみたい。`./static.ltdis.x86_64.txt`と`./static.ltdis.strings.txt`にあるらしいのでチェックする。色々書いてあるのでgrep。

```console
$ grep -o "picoCTF{.*}" ./static.ltdis.strings.txt
picoCTF{d15a5m_t34s3r_20335e41}
```

### strings it

> **Q.** ファイルから実行することなくflagを取得して

ダウンロードしたファイルはバイナリだった。分からないのでヒントを見るとstringsとある。
stringsコマンドはバイナリからテキストで表示できる部分を表示するみたいなので、grepにパイプを噛ませる。

```console
$ strings ./strings | grep -o "picoCTF{.*}"
picoCTF{5tRIng5_1T_60eA8fdA}
```

### plumbing

> **Q.** ファイルじゃないところからflagを探して

インスタンスを立ち上げるとhostnameとportが発行される。とりあえずncで接続すると、たくさん流れてきて切られた。
grepにパイプして絞っておく。適宜、下のhostnameとportは置き換える。

```console
$ nc hostname port | grep -o "picoCTF{.*}"
picoCTF{digital_plumb3r_00da27CC}
```

---

General Skills in CTF'sはここで終わり。お疲れ様でした!
