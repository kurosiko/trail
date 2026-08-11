---
title: "JUCEで作ったVSTがビルドできないときの直し方"
pubDate: 2026-08-11
description: "ProjucerのJUCEモジュール不足で発生したC2653・LNK1181・C1189を解決した記録"
author: "kurosiko"
tags: ["VST", "JUCE", "Projucer", "Visual Studio", "トラブルシューティング"]
---

# JUCEで作ったVSTがビルドできないときの直し方

JUCEのProjucerで初めてVSTを作っていたところ、Visual Studioのビルドで大量のエラーが発生した。最終的には、Projucerのモジュール設定を修正してプロジェクトを再生成することで解決できた。

## 発生した症状

最初に出ていた代表的なエラーは次のとおり。

```text
C2653: 'juce': is not a class or namespace name
LNK1181: cannot open input file 'MyFirstVST.lib'
```

`juce`名前空間が見つからないため、`AudioProcessor`や`AudioProcessorEditor`なども連鎖的に未定義になっていた。

`MyFirstVST.lib`が見つからないエラーは、ライブラリを作る前段階のShared Codeプロジェクトが失敗していたことによる二次的なエラーだった。

## 原因

Projucerのプロジェクト設定で、JUCEモジュールが正しく登録されていなかった。

特に、プロジェクトの`.jucer`ファイルにはモジュール設定がほぼなく、生成された`JuceHeader.h`もProjectInfoだけを含む状態だった。そのため、ソースコードが次のヘッダーを読み込んでも、JUCE本体のクラスが定義されていなかった。

```cpp
#include <JuceHeader.h>
```

## 修正手順

### 1. ProjucerでModulesを開く

Projucerで対象プロジェクトを開き、左側の`Modules`を選択する。

### 2. JUCEモジュールを追加する

`Add`から、プロジェクトに必要なモジュールを追加した。今回のプロジェクトでは、最終的に次のモジュールが登録された。

- `juce_audio_basics`
- `juce_audio_devices`
- `juce_audio_formats`
- `juce_audio_plugin_client`
- `juce_audio_processors`
- `juce_audio_processors_headless`
- `juce_audio_utils`
- `juce_core`
- `juce_data_structures`
- `juce_events`
- `juce_graphics`
- `juce_gui_basics`
- `juce_gui_extra`

モジュール追加後に表示される`Add missing dependencies`も実行した。

### 3. モジュールのパスを確認する

JUCEモジュールのパスは、プロジェクト内のJUCEディレクトリを指定する。

```text
C:\Users\Kurosiko\git\vastts\juce\modules
```

Projucerの設定では、各モジュールのパスが次のように生成された。

```text
../juce/modules
```

### 4. プロジェクトを再生成する

Projucer上部の`Save and Open in IDE`をクリックする。

これによって、`.jucer`の設定から次のファイルが更新される。

- `JuceHeader.h`
- `AppConfig.h`
- Visual Studioのソリューション・プロジェクトファイル

修正後の`JuceHeader.h`には、たとえば次のようなモジュールヘッダーが含まれる。

```cpp
#include <juce_audio_devices/juce_audio_devices.h>
#include <juce_audio_plugin_client/juce_audio_plugin_client.h>
#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_utils/juce_audio_utils.h>
```

### 5. Visual Studioで外部変更を読み込む

Visual Studioに次のダイアログが表示されたら、`Reload All`を選択する。

```text
File Modification Detected
The project has been modified outside the environment.
```

Projucerで生成した新しいプロジェクト設定をVisual Studioへ反映するために必要な操作だった。

### 6. CleanしてからRebuildする

Visual Studioのメニューから次の順に実行する。

```text
Build > Clean Solution
Build > Rebuild Solution
```

## 途中で発生した追加エラー

最初のモジュール追加後、次のエラーが残った。

```text
C1189: To compile AudioUnitV3 and/or Standalone plug-ins,
you need to add the juce_audio_utils and juce_audio_devices modules!
```

`juce_audio_devices`は追加済みだったが、`juce_audio_utils`が不足していた。`juce_audio_utils`をProjucerから追加して再度プロジェクトを生成したところ、このエラーも解消した。

## 最終結果

Visual Studioの出力は次の状態になった。

```text
Rebuild All: 4 succeeded, 0 failed, 0 skipped
Rebuild completed
```

生成されたものは次のとおり。

- VST3プラグイン
- Standalone Pluginの実行ファイル
- Shared Codeのライブラリ

なお、JUCE内部ファイルについてコードページに関する`C4819`警告が出たが、ビルドを失敗させるエラーではなかった。

## 今回の教訓

- `Clean Solution`は古い生成物を消す操作で、Projucerの設定不足そのものは直さない。
- `juce`名前空間が丸ごと見つからない場合は、ソースコードより先に`JuceHeader.h`とProjucerのModulesを確認する。
- `LNK1181`で`.lib`が見つからない場合は、そのライブラリを生成する前のプロジェクトのエラーを確認する。
- Audio Pluginでは`juce_audio_plugin_client`だけでなく、`juce_audio_utils`と`juce_audio_devices`も必要になることがある。
- Projucerで設定を変更した後は、必ず`Save and Open in IDE`、`Reload All`、`Clean`、`Rebuild`まで行う。
