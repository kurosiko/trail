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

ASCIIらしき文字列が返ってきた。解釈すると以下のとおり。

**Flag:** `picoCTF{g00d_k1tty!_n1c3_k1tty!_a94e7}`

### Tab, Tab, Attack

> **Q.** TAB保管を利用してflagを手に入れて

zipをダウンロードしてunzip、tabで探索。
実行ファイルとCのプログラムが出てきた。
実行ファイルは動かなかったため、Cのソースを確認。

**Flag:** `picoCTF{l3v3l_up!_t4k3_4_r35t!_fc588427}`

### Python Wrangling

> **Q.** スクリプトを使ってflagを入手して

catすると、先頭にusageを出す処理がある。
cryptography不足のエラーが出たため、追加して実行。

```text
Usage: ende.py (-e/-d) [file]
-eはencode、-dはdecodeを表す。ここでは-dを使う。
```

```console
$ uv run ende.py -d flag.txt.en
password.txtより
Please enter the password:720b6ad346f84cd483c60c7464dd95d4
```

**Flag:** `picoCTF{4p0110_1n_7h3_h0us3_9c5f9bcf}`

### Magikarp Ground Mission

> **Q.** SSHで接続してflagを探して

インスタンスを起動し、発行されたhostnameとportで接続。instructionを読んで探索する。

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

grepを使う。macOSでは正規表現の-Pオプションが使えないため、以下のコマンドを使う。

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

最後の`+`はcatを一度に実行する指定。イメージは以下のとおり。

```console
$ cat ./a.txt ./b.txt
```

`;`なら以下のように実行する。

```console
$ cat ./a.txt
$ cat ./b.txt
```

flagを発見する。

**Flag:** `picoCTF{f1nd_15_f457_ab443fd1}`

### Big Zip

> **Q.** unzipしてflagを探して

階層があるのでgrepを再帰的に検索する。

```console
$ grep -ro "picoCTF{.*}" ./big-zip-files/

./big-zip-files/folder_pmbymkjcya/folder_cawigcwvgv/folder_ltdayfmktr/folder_fnpfclfyee/whzxrpivpqld.txt:picoCTF{gr3p_15_m4g1c_ef8790dc}
```

flagが見つかる。

**Flag:** `picoCTF{gr3p_15_m4g1c_ef8790dc}`

### Static ain't always noise

> **Q.** バイナリをチェックしてくれ、bashスクリプトが助けになるよ!

スクリプトを実行すると権限拒否。実行権限を付与する。

```console
$ ./ltdis.sh
zsh: permission denied: ./ltdis.sh

$ chmod +x ./ltdis.sh
$ ./ltdis.sh

Attempting disassembly of  ...                                                      /Library/Developer/CommandLineTools/usr/bin/objdump: error: 'a.out': No such file or directory                                                                          Disassembly failed!
Usage: ltdis.sh <program-file>
Bye!
```

使い方が表示されたので、引数を指定する。

```console
$ ./ltdis.sh ./static

Attempting disassembly of ./static ...
Disassembly successful! Available at: ./static.ltdis.x86_64.txt
Ripping strings from binary with file offsets...                                    Any strings found in ./static have been written to ./static.ltdis.strings.txt with file offset
```

Disassembly結果は`./static.ltdis.x86_64.txt`と`./static.ltdis.strings.txt`に出力された。内容をgrepする。

```console
$ grep -o "picoCTF{.*}" ./static.ltdis.strings.txt
picoCTF{d15a5m_t34s3r_20335e41}
```

### strings it

> **Q.** ファイルから実行することなくflagを取得して

ダウンロードしたファイルはバイナリ。ヒントにstringsとある。
stringsはバイナリ内の可読テキストを表示する。grepにパイプする。

```console
$ strings ./strings | grep -o "picoCTF{.*}"
picoCTF{5tRIng5_1T_60eA8fdA}
```

### plumbing

> **Q.** ファイルじゃないところからflagを探して

インスタンスを起動するとhostnameとportが発行される。ncで接続すると大量の出力後に切断された。
grepにパイプして絞る。hostnameとportは適宜置き換える。

```console
$ nc hostname port | grep -o "picoCTF{.*}"
picoCTF{digital_plumb3r_00da27CC}
```

---

General Skills in CTF'sは以上。
