# Jev / Episode 004 実験比較

Jevはセリフだけを評価。実編集のcueは比較資料であり正解ラベルではありません。未記入の人間ラベルは一致率から除外します。

成功 12/12単位。3質問/単位。処理時間は通信・SDK処理を含むクライアント実測で、Jev内部の推論時間ではありません。

処理時間合計: 6442 ms / 中央値: 526 ms。
トークン合計: 入力 16144 / 出力 1458。
Gateway報告値（USD）: cost $0 / marketCost $0.000678048 / gatewayCost $0 / surchargeCost $0。

コストはAPIの返却フィールドをそのまま区別して記録。marketCostをcostに加算しません。未取得は0と区別します。

| 判断 | 人間ラベル件数 | 一致 | 一致率 |
|---|---:|---:|---:|
| visualAid | 0 | 0 | 未評価 |
| sectionChange | 0 | 0 | 未評価 |
| attentionReset | 0 | 0 | 未評価 |

一覧の各判断は「選択肢 / 選択確率 / provider confidence」。確率分布の詳細は下の各単位に記載。confidenceは0〜1で、選択確率や正解率とは区別します。

| 単位 / 秒 | セリフ | 視覚補助 | セクション切替 | 注意回復 | 実際の図解 / 近傍SE | 人間ラベル |
|---|---|---|---|---|---|---|
| ep004-c001 / 0.00 | 今日の朝。 | NONE / 99% / 0.99 | NO / 99% / 0.99 | NO / 84% / 0.68 |  /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c017 / 45.06 | でも半導体工場って、どうしてそこまで取り合いになるんだろう。 | NONE / 46% / 0.32 | YES / 82% / 0.63 | YES / 90% / 0.81 | farm-to-fab /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c034 / 109.69 | わざわざ全員が自分の国へ工場を欲しがる必要はないようにも見えますよね。 | NONE / 52% / 0.4 | NO / 83% / 0.66 | YES / 79% / 0.58 | world-team /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c050 / 166.08 | 学習に使うデータもある。 | NONE / 65% / 0.56 | NO / 99% / 0.98 | NO / 82% / 0.64 | compute-capacity /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c067 / 247.53 | 言うのは簡単ですよね。 | NONE / 95% / 0.93 | NO / 98% / 0.96 | YES / 52% / 0.04 | fab-lead-time /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c083 / 312.00 | では、各国は、いつからそこまで心配するようになったのか。 | NONE / 86% / 0.83 | YES / 92% / 0.84 | YES / 93% / 0.86 | shortage-cascade /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c100 / 374.71 | いろいろな場所へ入ろうとしています。 | NONE / 48% / 0.35 | NO / 76% / 0.52 | YES / 63% / 0.26 | shortage-cascade /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c116 / 435.23 | もし単純な国同士の勝負なら、「外国企業ではなく、 自国企業だけで作ろう」となりそうです。 | COMPARISON / 68% / 0.61 | YES / 59% / 0.18 | YES / 85% / 0.71 | multiple-locations /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c133 / 523.41 | 信頼できる国や企業との関係を作る。 | NONE / 47% / 0.32 | NO / 89% / 0.78 | YES / 51% / 0.01 | multiple-routes /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c149 / 588.00 | 国が取り合っているのは、これからもAIを作り続けられる能力と、 そのための選択肢なんです。 | DIAGRAM / 43% / 0.28 | NO / 94% / 0.88 | YES / 88% / 0.75 | capability /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c166 / 656.17 | だから各国は、外国との協力を続けながら、 自分たちが使える製造ルートも増やそうとしている。 | DIAGRAM / 73% / 0.66 | NO / 74% / 0.48 | NO / 58% / 0.16 | capability /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |
| ep004-c182 / 733.53 | それでは今回は、この辺で。 | NONE / 100% / 1 | NO / 95% / 0.9 | NO / 77% / 0.55 |  /  | visualAid=未判定, sectionChange=未判定, attentionReset=未判定 |

## 使用量・処理時間

| 単位 | ms | 入力token | 出力token | cost USD | marketCost USD | gatewayCost USD | surchargeCost USD |
|---|---:|---:|---:|---:|---:|---:|---:|
| ep004-c001 | 635 | 1230 | 121 | $0 | $0.00005166 | $0 | $0 |
| ep004-c017 | 489 | 1344 | 121 | $0 | $0.000056448 | $0 | $0 |
| ep004-c034 | 540 | 1384 | 121 | $0 | $0.000058128 | $0 | $0 |
| ep004-c050 | 609 | 1316 | 121 | $0 | $0.000055272 | $0 | $0 |
| ep004-c067 | 526 | 1378 | 121 | $0 | $0.000057876 | $0 | $0 |
| ep004-c083 | 617 | 1368 | 121 | $0 | $0.000057456 | $0 | $0 |
| ep004-c100 | 452 | 1296 | 121 | $0 | $0.000054432 | $0 | $0 |
| ep004-c116 | 501 | 1378 | 123 | $0 | $0.000057876 | $0 | $0 |
| ep004-c133 | 410 | 1356 | 121 | $0 | $0.000056952 | $0 | $0 |
| ep004-c149 | 638 | 1379 | 123 | $0 | $0.000057918 | $0 | $0 |
| ep004-c166 | 499 | 1407 | 123 | $0 | $0.000059094 | $0 | $0 |
| ep004-c182 | 526 | 1308 | 121 | $0 | $0.000054936 | $0 | $0 |

## ep004-c001 / 0.00–0.74 秒

> 今日の朝。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 99% / TEXT: 0% / IMAGE: 1% / DIAGRAM: 0% / COMPARISON: 0% | 0.99 |
| sectionChange | NO | YES: 1% / NO: 99% | 0.99 |
| attentionReset | NO | YES: 16% / NO: 84% | 0.68 |

## ep004-c017 / 45.06–48.90 秒

> でも半導体工場って、どうしてそこまで取り合いになるんだろう。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 46% / TEXT: 11% / IMAGE: 10% / DIAGRAM: 25% / COMPARISON: 8% | 0.32 |
| sectionChange | YES | YES: 82% / NO: 18% | 0.63 |
| attentionReset | YES | YES: 90% / NO: 10% | 0.81 |

## ep004-c034 / 109.69–114.55 秒

> わざわざ全員が自分の国へ工場を欲しがる必要はないようにも見えますよね。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 52% / TEXT: 5% / IMAGE: 2% / DIAGRAM: 33% / COMPARISON: 8% | 0.4 |
| sectionChange | NO | YES: 17% / NO: 83% | 0.66 |
| attentionReset | YES | YES: 79% / NO: 21% | 0.58 |

## ep004-c050 / 166.08–167.66 秒

> 学習に使うデータもある。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 65% / TEXT: 9% / IMAGE: 21% / DIAGRAM: 5% / COMPARISON: 0% | 0.56 |
| sectionChange | NO | YES: 1% / NO: 99% | 0.98 |
| attentionReset | NO | YES: 18% / NO: 82% | 0.64 |

## ep004-c067 / 247.53–248.99 秒

> 言うのは簡単ですよね。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 95% / TEXT: 0% / IMAGE: 3% / DIAGRAM: 1% / COMPARISON: 1% | 0.93 |
| sectionChange | NO | YES: 2% / NO: 98% | 0.96 |
| attentionReset | YES | YES: 52% / NO: 48% | 0.04 |

## ep004-c083 / 312.00–315.98 秒

> では、各国は、いつからそこまで心配するようになったのか。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 86% / TEXT: 3% / IMAGE: 2% / DIAGRAM: 8% / COMPARISON: 1% | 0.83 |
| sectionChange | YES | YES: 92% / NO: 8% | 0.84 |
| attentionReset | YES | YES: 93% / NO: 7% | 0.86 |

## ep004-c100 / 374.71–376.81 秒

> いろいろな場所へ入ろうとしています。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 48% / TEXT: 3% / IMAGE: 38% / DIAGRAM: 10% / COMPARISON: 1% | 0.35 |
| sectionChange | NO | YES: 24% / NO: 76% | 0.52 |
| attentionReset | YES | YES: 63% / NO: 37% | 0.26 |

## ep004-c116 / 435.23–441.87 秒

> もし単純な国同士の勝負なら、「外国企業ではなく、
> 自国企業だけで作ろう」となりそうです。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | COMPARISON | NONE: 20% / TEXT: 3% / IMAGE: 0% / DIAGRAM: 9% / COMPARISON: 68% | 0.61 |
| sectionChange | YES | YES: 59% / NO: 41% | 0.18 |
| attentionReset | YES | YES: 85% / NO: 15% | 0.71 |

## ep004-c133 / 523.41–526.23 秒

> 信頼できる国や企業との関係を作る。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 47% / TEXT: 10% / IMAGE: 3% / DIAGRAM: 39% / COMPARISON: 1% | 0.32 |
| sectionChange | NO | YES: 11% / NO: 89% | 0.78 |
| attentionReset | YES | YES: 51% / NO: 49% | 0.01 |

## ep004-c149 / 588.00–595.22 秒

> 国が取り合っているのは、これからもAIを作り続けられる能力と、
> そのための選択肢なんです。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | DIAGRAM | NONE: 20% / TEXT: 31% / IMAGE: 1% / DIAGRAM: 43% / COMPARISON: 5% | 0.28 |
| sectionChange | NO | YES: 6% / NO: 94% | 0.88 |
| attentionReset | YES | YES: 88% / NO: 12% | 0.75 |

## ep004-c166 / 656.17–662.63 秒

> だから各国は、外国との協力を続けながら、
> 自分たちが使える製造ルートも増やそうとしている。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | DIAGRAM | NONE: 13% / TEXT: 9% / IMAGE: 2% / DIAGRAM: 73% / COMPARISON: 3% | 0.66 |
| sectionChange | NO | YES: 26% / NO: 74% | 0.48 |
| attentionReset | NO | YES: 42% / NO: 58% | 0.16 |

## ep004-c182 / 733.53–735.23 秒

> それでは今回は、この辺で。

| 判断 | 選択 | 全選択肢の確率 | confidence |
|---|---|---|---:|
| visualAid | NONE | NONE: 100% / TEXT: 0% / IMAGE: 0% / DIAGRAM: 0% / COMPARISON: 0% | 1 |
| sectionChange | NO | YES: 5% / NO: 95% | 0.9 |
| attentionReset | NO | YES: 23% / NO: 77% | 0.55 |

## 実行履歴

最初の5単位はチャージ前、残り7単位はチャージ後。429のusage/costは未返却。コスト集計は成功12応答の報告値のみ。過去の403切り分け呼び出しは今回の件数に含めない。

Gateway送信15回（成功12、429が3）。成功済み単位の再送なし。待機間隔は処理時間に含めない。
