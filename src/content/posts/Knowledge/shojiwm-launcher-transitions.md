---
title: "ShojiWMのランチャーと画面遷移を設計する"
pubDate: 2026-11-24
description: "Adaptive Launcherと、状態のつながりを伝える遷移方針を整理する。"
author: "kurosiko"
tags: ["linux","shojiwm","ui"]
draft: true
---

## 背景と設計

ランチャーや画面を切り替えるとき、表示が変わった後も操作のつながりを追えるようにしたい。旧アニメーションの実装は未確認。設計ではランチャーにAdaptive Launcherを選び、画面の切替演出にFluid MorphとFade + Blurを採用した。

形や位置の変化を連続した動きとして見せる方法と、フェード・ぼかしで画面を入れ替える方法を使う。どの状態遷移にどの演出を当てるか、遷移の時間やイージングは実装時の検討が残る。Dashboard中央タブの演出も検討段階。

## 環境と確認状況

Linux向けShojiWM UI設計。UIフレームワーク・描画基盤・版は未確認。

演出の方針は決定。描画の実装、動作、負荷は未確認。
