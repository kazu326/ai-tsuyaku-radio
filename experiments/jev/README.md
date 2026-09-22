# Jev / AI通訳ラジオ 判断実験

完成済みEpisode 004のセリフに対するJevの判断を観察し、人間が実際に行った編集と比較するための独立CLI。動画、文章、演出案は生成しません。本番処理・Remotion・Webからの参照や呼び出しはありません。

**ステータス：実験終了（2026-09-23）。制作フローには導入しません。** 結論と12単位・36判断の結果は[検証記録](VERIFICATION.md)を参照してください。

## 境界

- 追加・更新・出力はこの `experiments/jev/` 以下のみ。
- 既存の台本、音声、字幕、実装、依存関係、環境ファイルは変更しません。
- `prepare` は元ファイルを読み、実験用スナップショットを保存します。`evaluate` は保存済み入力を評価します。
- 通信は `evaluate --live` の明示時だけ。デフォルトはdry run、12単位、単位ごとに3質問。自動再試行なし、1件30秒、最初の失敗で残りを停止。
- 実行ごとの結果は `runs/<RUN>/` に保存し、Git対象外。確定した12単位の統合結果 `runs/ep004-12-unit-review-20260919/` だけを検証記録としてGitに含めます。別ディレクトリへの出力指定はありません。実行済みrunは上書きせず、新しいrunを作ります。
- キーは `process.env.AI_GATEWAY_API_KEY` からのみ取得。`.env` の自動探索、キーの表示・コピー・保存はしません。
- 2026-09-19のユーザー承認により、実験の `zeroDataRetention: true` 指定を削除しました。HobbyではこのGateway機能が403になるためです。本番側の設定は変更していません。

## 入力と単位

ユーザー確認により、保存台本 `episodes/ep004-ai-semiconductor-race/script.md` ではなく、**完成動画の確定セリフ**である `video/remotion/src/episode4/captions.json` を使用します。保存台本の冒頭は「今、世界中で半導体工場が…」、完成動画は「今日の朝。…畑…」であり、実編集との比較では完成版を優先しました。

既存の意味単位の字幕1件を判断1単位とし、182単位を抽出。原文・改行・開始終了時刻をそのまま保存し、安定ID `ep004-c001`〜`ep004-c182` を付けます。字幕時刻の一部に重なりがありますが、修正しません。IDの意味は元ファイルのSHA-256とセットで固定されます。

Jevに送るものは、番組の対象視聴者、対象セリフ、直前3単位、直後1単位、3つの固定質問と選択肢のみ。サンプルの間隔が離れていても、前後文脈は全182単位から取得します。

画像・音声・台本全体・字幕時刻・章ラベル・人間のラベル・実編集cueはJevへ送りません。既存演出を知らない状態で、セリフからの判断を観察します。短い相づちや列挙も一単位なので、文脈の長さ・分割方法には検証の余地があります。

## 何を返すか

| キー | 選択肢 | 意味 |
|---|---|---|
| `visualAid` | NONE / TEXT / IMAGE / DIAGRAM / COMPARISON | 常設字幕・背景・猫以外の追加補助が理解に役立つか。複合案では主目的を一つ選択 |
| `sectionChange` | YES / NO | この単位で新しい話題・論点・説明段階が始まるか。冒頭はNO |
| `attentionReset` | YES / NO | この単位の開始で注意を戻す短い強調などが有効そうか |

3質問とも `type: 'choice'`。YES/NOもChoiceにする理由は、TypeSafeの独立したconfidenceを全項目で観察するためです。Boolean/NoulのP(true)はconfidenceと同じ値ではありません。

各項目に `choice`、全選択肢の `probabilities`、`selectedProbability`、`confidence` を保存。後二項目の `value` は比較用にbooleanへ変換します。confidenceは `providerMetadata.typesafe.confidence[questionId]` の値を保存し、選択確率で代用しません。返却がなければ `null / not-returned`。原回答、usage、rounding、モデルID、応答時刻、処理時間も保存します。Gatewayが返す `cost` / `marketCost` / `gatewayCost` / `surchargeCost` も別々に保存し、未返却はnullです。APIキー、HTTPヘッダー、生の例外本文は通常の実行結果へ保存しません。

confidenceが高くても編集上正しいとは限りません。注意回復の回答もセリフからの仮説であり、実際の視聴維持率や音声表現を評価した結果ではありません。

## 実行

Node.js 24以上、pnpm 11。実験フォルダ内で実行します。依存は `ai@7.0.105` と実験専用の型検査ツールだけ。pnpm-lock.yamlで間接依存も固定します。

```powershell
cd C:\Users\kukyo\Documents\ChatGPT\ai-tsuyaku-radio\experiments\jev
pnpm install --frozen-lockfile --ignore-scripts --store-dir .pnpm-store
node --test test/*.test.mjs
node node_modules/typescript/bin/tsc --noEmit

# 通信なし。表示されたRUN名を以下の <RUN> に入れる
node src/cli.mjs prepare
node src/cli.mjs evaluate --run <RUN> --limit 12

# 環境変数が設定済みのシェルで実APIを呼ぶ
node src/cli.mjs evaluate --run <RUN> --limit 12 --interval-ms 15000 --live
```

既存のリポジトリ直下 `.env.local` を使う場合は明示的に読み込めます。ファイルは読み取りだけで、この実験にコピーしません。

```powershell
node --env-file=../../.env.local src/cli.mjs evaluate --run <RUN> --limit 12 --interval-ms 15000 --live
```

pnpmがPATHにないこのCodex環境では、インストール時に次を利用しました。アプリの同梱ランタイムの位置は環境により変わります。

```powershell
node C:/Users/kukyo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pnpm/bin/pnpm.cjs install --frozen-lockfile --ignore-scripts --store-dir .pnpm-store
```

`--limit 12` は先頭から末尾まで等間隔に選びます。特定箇所を選ぶ場合は `--limit` の代わりに `--ids ep004-c041,ep004-c060`。今回の対象は予定した12単位だけです。

`--interval-ms` は次の送信までの待ち時間（0〜60000ms、省略時0）。処理時間の計測には含めません。無料枠は数分以上の間隔でも429になる場合があり、15秒間隔での成功は保証しません。429で停止したら、成功済みIDを再送せず、制限解除後に新しいrunへ未完了IDだけを指定してください。課金設定は変更しません。

通信開始後は成功・失敗にかかわらず、同じrunでは再実行しません。認証修正後、質問変更後、サンプル変更後は再度 `prepare`。中断した場合も `evaluation.jsonl` に送信前の入力と完了済み結果が残ります。中断runの自動再開・再課金は行いません。

## 保存ファイルと比較

| ファイル | 内容 |
|---|---|
| `input.json` | 全182単位、原本パス・SHA-256、分割方法、質問版、質問全文、比較用cue、dataset ID |
| `human-labels.json` | 人間が記入する比較用ラベル。最初は全てnull |
| `evaluation.jsonl` | 送信前の論理リクエストと各応答。失敗・未送信も区別 |
| `results.json` | Jevの分類・確率・confidence・usage、失敗情報 |
| `comparison.json` / `comparison.md` | セリフ・時刻・Jev判断・実編集cue・人間ラベルを並べた比較表 |
| `comparison.csv` | 全選択肢の確率、各confidence、処理時間、token、コストを含む表。Excel用UTF-8 BOM付き |
| `summary.json` | 成功件数、判断分布、使用量・コスト・処理時間の集計 |
| `comparison-<時刻>.json/.md/.csv` | 人間ラベル記入後に再集計した比較表 |

`slide-cues.json`、`se-cues.json`、`timeline.json` は比較資料として読み取ります。セリフの時間区間と重なる有効なスライド、区間の前後1秒を含むSE開始を表示し、SEのフレームは原本のfpsで秒へ変換します。実装詳細は既存の `Episode4Slides.tsx` / `Episode4Main.tsx` と完成動画で確認できます。

これらは制作時の配置記録です。**cueの存在から「人間がDIAGRAMを選んだ」「注意回復を意図した」と自動ラベル付けしません。** レンダリング後の人間編集もcueに含まれない可能性があります。完成動画を見て確かめてください。

1. `human-labels.json` の対象IDに、実際に採用した視覚補助（文字列）、セクション切替（true/false）、注意回復演出（true/false）を記入。
2. 未確認・意図不明は `null` のまま。`evidence` に動画の秒数・編集記録、`notes` に分類の曖昧さを記入。
3. `node src/cli.mjs compare --run <RUN>` を実行。入力を再送せずローカルで比較。

ラベルごとの一致率は、成功したJev判断かつ人間ラベルがあるものだけが分母。無ラベル・通信失敗・未送信は除外します。人間の採用判断との一致率であって、動画品質の正解率ではありません。

## 現在の検証結果

2026-09-19の結果は [VERIFICATION.md](VERIFICATION.md)。オフラインテストと実API呼び出しを区別して記録します。

12単位・36判断の取得を完了：[全確率とconfidenceを含む比較表](runs/ep004-12-unit-review-20260919/comparison.md) / [CSV](runs/ep004-12-unit-review-20260919/comparison.csv)。この統合結果だけをGitに保存し、途中の診断runはローカルに保持します。13テストと型検査に合格。無料枠の429で中断した5単位と、チャージ後の7単位を統合しています。

## 確認した公式仕様（2026-09-19）

- [TypeSafe Introduction](https://docs.typesafe.ai/introduction)：共通stateに対する型付き判断。
- [TypeSafe Choice](https://docs.typesafe.ai/primitives/choice)：選択肢、確率分布、confidence。
- [TypeSafe Confidence](https://docs.typesafe.ai/confidence)：confidenceは確率分布に由来する統計量。Noulには別confidenceがない。
- [Vercel Evaluation](https://vercel.com/docs/ai-gateway/modalities/evaluation)：AI SDK 7以降、`experimental_evaluate` / `gateway.evaluationModel`。GatewayのOpenAI互換chat-completionsでは呼べない。
- [Vercel Jevリリース](https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway)：7.0.105以降のAPI、confidenceのmetadata位置。
- [Vercel Jevモデル](https://vercel.com/ai-gateway/models/jev)：`typesafe-ai/jev`。
- [Vercelモデル一覧API](https://ai-gateway.vercel.sh/v1/models)：実取得して `typesafe-ai/jev` / `type=evaluation` / ZDR対応を確認。

加えてインストール済み `ai` の `docs/03-ai-sdk-core/32-evaluation.mdx`、`src/evaluate/`、Gateway providerの `gateway-evaluation-model.ts` を確認し、実験用adapterを型検査。仕様はexperimentalのため、勝手に依存バージョンを更新せず、変更時は新しいrunで再検証します。

人間ラベル付きの照合や前後文脈・単位長・別Episodeでの再現性検証は未実施です。今回の実験はここで終了し、AI通訳ラジオでの再検討条件は[検証記録](VERIFICATION.md)に記載します。
