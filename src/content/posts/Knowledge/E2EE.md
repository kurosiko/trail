---
title: "E2EEのためのアーキテクチャ"
pubDate: 2026-09-15
description: "アプリケーションの連携などのE2EE同期のためとかの仕組み"
author: "kurosiko"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "ピンク色に輝く暗い背景に浮かぶAstroのロゴ。"
tags: ["picoCTF"]
---

# E2EEのためのアーキテクチャ
今回の記事はあんまり質に自信がありません。あらかじめご了承いたす。
今回は一例としてQRログインを使うアプリケーション連携のものを見る。

 createSession()

      ↓

createQrCode()

      ↓

QR用E2EE secret生成

      ↓

QR URLにsecretを付与

      ↓

checkQrCodeVerified()

      ↓

verifyCertificate()

      │

      └─失敗→ PIN認証

                ↓

         checkPinCodeVerified()

      ↓

qrCodeLogin()

      ↓

certificate保存

      ↓

E2EE鍵処理

      ↓

authToken 


まずサーバーにセッションを作ってもらう。
次にPC側で秘密鍵とsessionIdを含めたQRコードを作成する。
これをスマホで直接読み取ることで秘密鍵を共有せずに秘密鍵を入手できる。今後はこの秘密鍵で暗号化を通じて通信することにする。
ここでQRコードを盗まれると他人でもログインできてしまうので、その対策をする必要がある。ここで分岐が発生して、もし証明書がデバイスに存在すれば認証をokして、失敗するであるようであればpinを使った認証に進む。pinから認証した場合には証明書を発行して、どちらもtokenへ発行してもらう。