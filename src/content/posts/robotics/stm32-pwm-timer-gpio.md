---
title: "STM32タイマーのPWM生成"
pubDate: 2026-11-24
description: "ARR・CCR・タイマーチャネル・GPIOの代替機能を順に追う。"
author: "kurosiko"
tags: ["robot","stm32","pwm"]
---

## 背景と仕組み

モーターの速度指令を受け取ったら、タイマーの比較値に変換し、対応するGPIOからPWMを出す。GPIOの代替機能は、タイマーチャネルの出力をピンへつなぐ役割を持つ。

アップカウント、エッジアライン、PWM mode 1、アクティブHighを例にする。タイマーは 0 から ARR まで数え、CNT が CCR 未満の間に出力が有効になる。例えば ARR = 999、CCR = 250 なら、1000カウント中250カウントが有効となり、デューティ比は25%。周期はタイマークロックとプリスケーラにも依存する。

実機では対象チャネルとピンの代替機能を確認し、出力の周期とデューティ比を測る。指令に対する回転数は、ドライバや負荷の影響も受ける。

周波数の計算には、タイマー入力クロック `f_TIM` とプリスケーラ `PSC` を使う。この例のモードでは `f_PWM = f_TIM / ((PSC + 1) × (ARR + 1))`。たとえば入力が仮に80 MHz、PSCが79、ARRが999なら1 kHzになる。実機の `f_TIM` はクロックツリーで確認する。CPUクロックと同じ値を入れるとは限らない。

CNTとCCRの比較で波形が決まり、チャネルの出力許可とGPIOの代替機能でピンまで届く。波形が出ないときは、カウンタの動作、出力許可、ピン割当の順に切り分けられる。TIM1などではメイン出力許可も確認する。

## CNTがリセットされるとPWMの次の周期が始まる

波形を短く描くため、図では `ARR=3`、`CCR=1` を使う。カウンタの1刻みは `(PSC+1)/f_TIM` 秒。CNTが0の区間だけ、`CNT < CCR` が成り立つ。CNTがARRに達した次の刻みで0に戻り、再びHighになる。

<figure class="post-diagram">
<svg viewBox="0 0 360 227" role="img" aria-labelledby="pwm-title pwm-desc">
<title id="pwm-title">アップカウント時のCNTとPWM出力</title>
<desc id="pwm-desc">ARRが3でCCRが1。CNTは0、1、2、3、0、1と進む。PWMは0の区間のみHigh。1周期はカウンタ4刻み。</desc>
<path class="diagram-guide" d="M70 31V195 M113 31V195 M156 31V195 M199 31V195 M242 31V195 M285 31V195 M328 31V195 M60 93H328"/>
<path class="diagram-arrow" d="M70 113h43V93h43V73h43V53h43v60h43V93h43"/>
<path class="diagram-axis" d="M70 144h43v31h129v-31h43v31h43"/>
<path d="M70 197H242 M70 193v8 M242 193v8"/>
<text x="10" y="32">CNT</text><text x="9" y="57">3 ARR</text>
<text x="48" y="77">2</text><text x="9" y="97">1 CCR</text><text x="48" y="117">0</text>
<text x="249" y="48">0へ戻る</text>
<text x="15" y="148">High</text><text x="15" y="180">Low</text>
<text x="113" y="217">1周期（4刻み）</text>
<path d="M268 197h61m-7-4 7 4-7 4"/><text x="334" y="202">t</text>
</svg>
<figcaption>PWM mode 1、エッジアライン、アップカウント、アクティブHighの計算例。上がCNT、下がピンのPWMレベル。</figcaption>
</figure>

この条件のデューティ比は `CCR/(ARR+1)`（`0 ≤ CCR ≤ ARR+1` の場合）。`CCR=0` なら常時Low、`CCR=ARR+1` をレジスタに格納できれば常時High。CCRとARRが同じ幅でARRを最大値にした場合、`ARR+1` は収まらない。センターアラインでは往復のカウントを使い、アクティブLowでは有効時のピンレベルが逆になる。設定変更を周期境界で反映したいときは、ARR・CCRのプリロードと更新イベントを確認する。

STM32F446REの内部クロックで動くTIM3はAPB1側。RM0390によると、`TIMPRE=0` ではAPB1プリスケーラが1なら `f_TIM=PCLK1`、分周時は `f_TIM=2×PCLK1`。たとえば `PCLK1=40 MHz` で分周していればタイマー入力は `80 MHz` になる。`TIMPRE=1` のときは別の倍率になるので、RCCの設定を確認する。タイマーの種類や機種が変われば、レジスタ幅、クロックの接続先、チャネルやピンの割当も確認し直す。

デューティ比は周期中の有効時間の割合。回転数は電源、負荷、ドライバの方式、摩擦などにも依存する。目標回転数に合わせる場合は、実際の回転数を計測して電圧やデューティの指令を調整する。

## 環境と確認状況

STM32F446RE、C。HAL・コンパイラの版とタイマークロックは未確認。

活動報告で信号経路の理解を確認。実機出力と回転数の測定は未確認。

## 参照元

- [STMicroelectronicsのSTM32F446製品ドキュメント](https://www.st.com/en/microcontrollers-microprocessors/stm32f446/documentation.html)

- [STM32F446xx RM0390、RCCと汎用タイマーのPWM mode](https://www.st.com/resource/en/reference_manual/DM00135183.pdf)
