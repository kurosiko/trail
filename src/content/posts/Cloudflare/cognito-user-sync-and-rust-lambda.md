---
title: "CognitoとD1のユーザー同期"
pubDate: 2026-11-24
description: "登録時の同期と初回ログイン時の同期を比較し、Rust Lambdaの開発方針を記録する。"
author: "kurosiko"
tags: ["cognito","lambda","rust","d1"]
---

## 背景と設計

Cognito登録後にD1へユーザーを作る場所として、Post Confirmation Lambdaを検討した。登録確認時に同期できる一方、LambdaからD1へ書き込む経路、その認証、同期が失敗した後の再処理が必要になる。

代替案は初回ログイン時にWorkersがD1 Bindingで同期する方式。外部ユーザーIDの一意制約を使い、処理が再実行されても同じユーザーへ解決する。ログイン前にD1のレコードが必要な場合は、同期のタイミングが合うか確認が要る。

Lambdaの言語はJavaも検討した後にRustを希望し、npmのグローバル導入を避けるため、Rust・Zig・Cargo Lambdaをmiseで管理する方針を選んだ。以下は当時の検討コマンド。

```bash
mise install rust zig github:cargo-lambda/cargo-lambda
mise exec -- cargo lambda watch --locked --invoke-address 127.0.0.1
```

## 再実行できる書き込みにする

初回ログイン時に「SELECTして、なければINSERT」とすると、同時に来た2件がどちらも未登録と判断できる。外部IDに一意制約を置き、衝突時の処理をデータベースに任せると、同時実行でも行が増え続けない。次はSQLiteでの説明例。既存ユーザーの所属や権限を上書きする必要はない。

```sql
CREATE TABLE app_users (
    id INTEGER PRIMARY KEY,
    issuer TEXT NOT NULL,
    subject TEXT NOT NULL,
    UNIQUE (issuer, subject)
);
INSERT INTO app_users (issuer, subject) VALUES (?, ?)
ON CONFLICT (issuer, subject) DO NOTHING;
```

| 作成の契機 | 作成される時点 | 障害時に追う境界 |
| --- | --- | --- |
| Post Confirmation Lambda | Cognito側の登録確認時 | Cognitoの確認状態とD1への反映を別々に確認する |
| Workersのログイン処理 | アプリへ初めてログインしたとき | D1へ作成できるまでアプリのセッション発行を保留できる |

登録直後にアプリ側からユーザーを参照する要件があるなら、ログインまで行がない方式では満たせない。どちらでも、同期後の行を再取得するときのキーは同じ組を使う。

## 登録成功と同期失敗を分けて扱う

Cognitoの登録確認が成功しても、LambdaからD1への書き込みまで成功するとは限らない。D1側の一時障害やタイムアウトで結果が不明になった場合、同じ `(issuer, subject)` のUPSERTを再試行する。成功済みの行を上書きして所属や権限を変えないため、同期処理は識別子の確保と属性更新を分ける。

同期状態を追跡する場合は、最後の試行結果と再試行可能性を別に保存する。ログイン時に未同期を検出したらセッション発行を保留して再試行し、繰り返し失敗する場合はCognitoのユーザーを削除する処理へ短絡させず、運用者が整合性を回復できる状態を返す。Post Confirmationのトリガーは登録確認後に呼ばれるが、外部DBとの分散トランザクションを提供しないため、CognitoとD1の状態を照合する再処理経路が必要になる。Post Confirmationはパスワード再設定時にも呼ばれるため、登録確認だけを対象にするなら `triggerSource` で処理を分ける。

```mermaid
flowchart TD
  accTitle: 登録確認後のD1同期と復旧
  C[Cognitoで登録確認] --> L[Post Confirmation Lambda]
  L -->|認証済みの書込経路| D{D1でユーザーを確保できたか}
  D -->|成功| S[同期済み]
  D -->|失敗または結果不明| R[同期状態を照合して再試行]
  R -->|同じ外部ID| D
```

図はLambda経由を採った場合の設計。LambdaはWorkersのD1 Bindingを直接使えないため、認証済みのWorkerエンドポイントなどを経由する。Workersで初回ログイン時に同期する案では、検証済みのトークンから同じ外部IDを取り出し、BindingでD1へ直接書き込む。復旧ジョブの登録にも失敗した場合に備え、Cognitoの確認済みユーザーとD1を定期的に照合する経路があると、欠けた行を検出できる。

## 環境と確認状況

Cognito Post Confirmation、Workers・D1、Rust、Zig、mise、Cargo Lambda。各SDK・ツールの版は未確認。

Rust Lambdaのツール選択までは方針を確認。同期方式の最終採用、コマンドの実行、D1連携は未確認。

SQLite 3.54.1のインメモリDBでは、同一の `(issuer, subject)` を2回登録しても1行、同じ `subject` で別の `issuer` を登録すると合計2行になることを確認した。

- [Cognito Post Confirmationトリガー](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html)
- [SQLite UPSERT](https://www.sqlite.org/lang_upsert.html)
