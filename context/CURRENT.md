# AI通訳ラジオ — CURRENT

最終更新：2026-10-01（JST）

このファイルは作業開始時に読む現在地です。詳細な経緯は `logs/`、固定方針は `context/`、共有設計は `docs/`、本社・物語世界の設定は `world/` 内の各文書を参照します。

## 現在地

Season 1（Episode 001〜006）は完了。

Episode 006「なぜAI企業はモデルを公開するのか：オープンモデルの経済」は、現時点での長編制作ベンチマーク。台本・音声・字幕・Remotion・Canvas 2D・AIによる映像ディレクションを相互に接続した制作フローとして運用できた。

9月末〜10月1日にかけて、Webトップ、本社空間、スタジオ生成素材、3D試作、世界設定を大きく進めた。その過程で、AIの生成速度が人間の理解・レビュー速度を上回る問題、生成画像の空間的不整合、不採用素材の整理、複数AI間でSource of Truthを共有する必要性が明確になった。

現在は、これらを別々の寄り道ではなく、**人間とAIが実際に一緒に働く小さなAIネイティブ組織を運営し、その経験をKnowledgeとコンテンツへ戻す実験**として整理し直している。

---

## 現在の組織モデル

基本関係：

```text
Real Member
  ↓
World Model Seed
  ↓ 実務を通じて成長
必要な場合だけ
  ↓
Actor
```

- Real Member：現実の人間。責任と最終判断を持つ
- World Model Seed：内部で実務を通して育つAI作業単位
- Actor：外部との接点が必要になったSeedが持つ表現層

現実の人間を架空Actorとして扱わない。内部処理だけのSeedはActor化しない。

正本：

- `context/ORGANIZATION_MODEL.md`
- `context/ACTOR_WORLD_MODEL.md`
- `context/WORLD_MODEL_SEEDS.md`
- `context/ACTORS.md`

現在、猫はBaseline Actor。Opening由来の担当者候補に加え、Narrative Secret由来のSeed Candidateが存在する。Narrative Secretはストーリー上の秘密であり、存在や出典は隠さなくてよいが、通常の公開・Actor会話では明示的な答え合わせを避ける。

---

## AI通訳ラジオ本社システムの方向

### 本体

GitHubを引き続きSource of Truthとする。

### 入口

Cloudflareを「AI通訳ラジオ本社の入口」として段階的に整備する。

内部Real Memberは認証後、Codex / Claudeなど自分に合うAIクライアントから共通のMCPインターフェースへ接続できる状態を目指す。

一般ユーザーは公開コンテンツだけを利用できる。

### MCP

最初から大量の機能を持たせず、

- 現在地を読む
- 必要な社内資料を探す
- Task用Contextを取得する
- branch / PRで変更を提案する
- Observationを残す

程度の小さな会社インターフェースから始める。

### 3D Presence

内部メンバー向けに、軽量Three.js等を使ったゲーム風の3D本社を実験候補とする。

目的はフォトリアル表現ではなく、

- 誰がいるか
- どこにいるか
- 何をしているか
- 話しかけられそうか

を感じやすくし、リモート作業の孤独感やコミュニケーション摩擦を減らせるか確認すること。

Presenceがなくても仕事は成立する設計にする。

共有設計：

- `docs/SYSTEM_OVERVIEW.md`
- `docs/SYSTEM_ARCHITECTURE.md`
- `docs/REAL_MEMBER_ONBOARDING.md`
- `docs/PARALLEL_WORKSTREAMS.md`

---

## 本社・スタジオ空間

本社は2階建て。

- 1階A：メイン収録区画
- 2階B：正式にはサブ収録区画

本社全体の空間配置は以下を基準にする。

- `experiments/headquarters-plan-20261001/headquarters-layout.json`
- `experiments/headquarters-plan-20261001/headquarters-floorplans.pdf`
- `experiments/headquarters-plan-20261001/README.md`

2階Bの正式用途は今後も「サブ収録用」のまま。

**2階Bの録音室・コントロールルーム内部の詳細図はユーザーが作成し、その詳細図を本社側の仮枠・座標・3Dへ反映する。** AIは未確定の内部配置を旧生成画像から推測して確定しない。

世界設定は用途を分けて管理する。Narrative Secretはセキュリティ上の機密ではなく、伏線・推測・偶発的な漏れを許容するストーリーテリング上の秘密として扱う。Protected Information（保護情報）とは分ける。

世界設定：

1. `world/HQ_PUBLIC.md`
2. `world/HQ_BEHIND_THE_SCENES.md`
3. `world/HQ_SECRET.md`

旧スタジオ生成素材は2026-10-01に整理済み。採用素材・比較記録・生成履歴・旧3D再現に必要なコアのみ現行ツリーへ残している。

3Dの映像用途では、最終フォトリアル画像そのものより先に、空間・座標・カメラ角度の一貫性を作る。

Presence用途では同じ本社座標を使いつつ、軽量ゲーム風3Dとして別の品質目標を持つ。

---

## 並行Workstream

**現時点では全体の優先順位を固定しない。**

必要性、興味、依存関係、利用可能な時間に応じて複数を並行して進める。

現在のWorkstream：

- Company Entrance / Cloudflare / MCP
- Real Member Onboarding
- Organization / World Model Seed
- 3D Presence
- HQ Spatial / Studio B / Media Assets
- Season 2 / Main Content
- Knowledge / Content from Operations

詳細と各レビュー地点は `docs/PARALLEL_WORKSTREAMS.md` を参照する。

直近では、新しいReal Memberが参加する実運用そのものをObservationとして残す。

---

## Knowledgeとコンテンツ化

作業のたびに長い日報を書く運用にはしない。

最低限：

1. 何をしようとしたか
2. 何が起きたか
3. 何が予想外だったか
4. どう判断したか
5. 再利用できるKnowledgeやコンテンツ候補があるか

を残す。

AIが後から、

- Observation
- Decision
- Knowledge
- Episode / 記事候補

へ整理できる形を目指す。

実際の失敗・改善・運営経験を、AI通訳ラジオの一次情報として活用する。

---

## 長期方向

長期ビジョンは `context/VISION.md`。

現時点では、

- この仕組みをすぐ商品化すること
- 企業導入効果を断定すること
- 柔軟な働き方が全員に有効だと断定すること
- 補助金・助成金の利用を前提に設計すること

はしない。

まず小規模に実際に使い、参加しやすさ、AI活用の学習、コミュニケーション、Knowledge再利用、経済性を観察する。

---

## Season 1終了時点の制作フロー

現在もっとも有力な長編制作の流れは次。

台本完成
↓
映像ディレクション
↓
ElevenLabsで音声生成
↓
音声の前後処理・完成音声タイムライン確定
↓
Forced Alignmentで正確な発話時刻を取得
↓
必要な区間だけCanvas 2D等を実装
↓
Remotionで背景・Canvas・猫・字幕・章タイトルを統合
↓
全編レンダー
↓
人間レビュー

映像ディレクション段階では絶対時刻を固定せず、台本の発話・行をキーとして「どこを動かすか」を決める。音声完成後にForced Alignmentで実測時刻を作り、映像要素を最終タイムラインへ追従させる。

---

## 現在の判断原則

制作方法を最初から大きなルールシステムにしない。

実際に作る
↓
人間が見る・聞く
↓
違和感を特定する
↓
原因を考える
↓
最小限修正する
↓
別の制作でも再現したらルールへ昇格する

前回のチャットで決めたことを「AIが覚えているはず」で運用しない。次回も必要な情報はGitHub上のSource of Truthへ残す。

AIの制作速度が人間のレビュー速度を超える場合は、代表サンプルやブロッキング段階で止め、人間確認後に量産・仕上げへ進む。

---

## Quick Resume

現在：GitHub本体、本社平面図、世界設定、Seed / Actorの基礎ができた。次は一つの大型タスクへ集中するのではなく、Cloudflare/MCP、Real Member参加、3D Presence、Studio B、Season 2、Knowledge化を並行Workstreamとして小さく進める。

組織：Real Member → World Model Seed → 必要ならActor。

システム：GitHub = 本体、Cloudflare = 入口、MCP = 共通会社インターフェース、3D Presence = 内部のつながりを感じる軽量UI。

次回：`docs/PARALLEL_WORKSTREAMS.md` から、その時点で必要・進めやすいWorkstreamを一つ選び、レビュー可能な最小単位まで進める。
