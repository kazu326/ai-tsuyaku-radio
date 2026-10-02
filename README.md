# AI通訳ラジオ

> AIの難しい話を、わかる言葉に。

AI業界の難しいニュース・技術・専門用語を、AIに詳しくない人でも一度聞いて核心を理解できる言葉へ「通訳」するメディアプロジェクトです。

同時に、AI通訳ラジオ自身が**人間とAIエージェントが実践を通して一緒に成長する実験組織**でもあります。

このリポジトリを、AI通訳ラジオの制作・知識・ブランド・意思決定を共有する **Source of Truth（正本）** として育てます。**このリポジトリは公開されています。** 個人情報、顧客や勤務先の資料、認証情報は置きません。

## 基本構造

- `context/` — AI・人間が最初に確認する現在地、ブランド、編集方針、組織モデル、確定事項
- `docs/` — 人間向け概要、オンボーディング、システム設計、並行Workstream
- `world/` — 本社・物語世界などの設定。表設定／裏設定／秘密設定を用途別に分離
- `episodes/` — 各エピソードのリサーチ、台本、記事、SNS派生物
- `knowledge/` — 複数テーマで再利用する知識・調査
- `video/` — 動画制作。Remotion本番環境は `video/remotion/` へ統合済み
- `web/` — Webサイト・公開レイヤー
- `social/` — SNS向け運用・共通素材
- `experiments/` — 採用前の試作・検証。存在していることと採用済みであることは同義ではない
- `logs/` — 日々の観察・作業・意思決定に至った経緯

## 組織とWorld Model Seed

AI通訳ラジオでは、完成した「AI社員」を全員へ配ることを目指しません。人・組織ごとに異なるWorld Model Seedを、実務の経験から育てます。

- 組織モデル（Real Member / Seed / Actor）：`context/ORGANIZATION_MODEL.md`
- 現在のSeed一覧：`context/WORLD_MODEL_SEEDS.md`
- Seedを人・組織に合わせて作り育てる仕組み：`context/WORLD_MODEL_SEED_SYSTEM.md`
- 情報の性質と所属Scope：`context/KNOWLEDGE_MODEL.md`
- 新規Real Member：`docs/REAL_MEMBER_ONBOARDING.md`

## コンテンツの3本柱

1. **AIニュース解説** — 新しいAIニュースや企業発表を、何が起きたか・なぜ重要かまで整理する
2. **難解トピック翻訳** — GPU、推論、コンテキスト、MCP、AIエージェント、半導体などを一般の言葉へ翻訳する
3. **音声・動画コンテンツ** — AI通訳ラジオ本編、特集、動画コンテンツ

## 制作の考え方

一つのテーマを深く調査し、その知識を動画・Web記事・SNSなどへ再利用します。媒体ごとにゼロから別コンテンツを作るのではなく、AI通訳ラジオをContent Hub / Knowledge Baseとして蓄積します。

記事先行・動画先行は固定しません。テーマに応じて最初に作りやすい媒体から始め、完成した成果物を次の媒体のコンテキストとして利用します。

## AIが作業を開始するとき

共通の作業ルールは `AGENTS.md` を確認してください。

基本の開始順は次です。

1. `AGENTS.md`
2. `README.md`
3. `context/CURRENT.md`
4. 作業内容に応じた関連資料

必要に応じて `context/BRAND.md`、`context/EDITORIAL.md`、`context/DECISIONS.md`、`context/ORGANIZATION_MODEL.md`、`context/WORLD_MODEL_SEED_SYSTEM.md`、`context/KNOWLEDGE_MODEL.md`、`docs/README.md`、過去ログへ進みます。

日々のログと現在地は分離します。 `logs/` は経緯を残す場所、`context/` は現在有効な情報を短く保つ場所です。

人間が全体像を把握したい場合は `docs/SYSTEM_OVERVIEW.md`、新しいReal Memberは `docs/REAL_MEMBER_ONBOARDING.md`、実装担当は `docs/SYSTEM_ARCHITECTURE.md` を参照します。

## 採用状態の確認

**リポジトリにファイルが存在することと、現在採用されていることは同義ではありません。**

特に `experiments/`、生成画像、生成動画、3D試作には、不採用・参考専用・部分採用の素材が残っています。利用前に、その実験フォルダの `README.md`、`adoption-status.json`、`asset-policy.json` など、採用状態を示す資料を確認してください。

現在の本社・スタジオ空間については、`experiments/headquarters-plan-20261001/` と `experiments/studio-spatial-foundation-20261001/` の現行方針を優先します。

## 世界設定の読み分け

本社設定は、必要な情報だけを段階的に参照します。

- 通常の図面・画像・3D・Web制作：`world/HQ_PUBLIC.md`
- 猫の活動や物語上の裏側が必要な場合：`world/HQ_BEHIND_THE_SCENES.md`
- Narrative Secretの根拠確認・制作レビュー・真相演出：`world/HQ_SECRET.md`

Narrative Secretは内部の根拠確認や制作レビューで参照して構いません。ただし通常のWeb・図面・3D・公開出力へ自動的に答え合わせを持ち込まず、`world/HQ_SECRET.md` のReveal Policyに従います。

## Remotionについて

Remotion本番環境は `video/remotion/` へ統合・検証済みです。旧 `ai-radio-remotion-test` はコピー元スナップショットとして保護しています。現在の状態と移植記録は `context/CURRENT.md` および `video/remotion/MIGRATION.md` を参照してください。
