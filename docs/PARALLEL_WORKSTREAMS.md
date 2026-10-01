# AI通訳ラジオ｜Parallel Workstreams 2026-10-01

Status: Draft for review  
Priority: **未設定。必要性・興味・依存関係に応じて並行して触る。**

## 使い方

これは優先順位表ではない。

複数のReal Member、Codex、Claudeなどが同時に作業しても、互いの前提を壊しにくくするための境界表。

各Workstreamは、小さな成果物を出してレビューしたら次へ進む。

## 並行実行の原則

**原則として、すべてのWorkstreamは並行して進めてよい。**

組み合わせ表は維持しない。明示的な依存関係または衝突がある場合だけ、そのWorkstream内に `Dependency` / `Conflict` として記載する。

---

## A. Company Entrance / Cloudflare / MCP

### Goal

GitHubにあるAI通訳ラジオ本体へ、認証された共通入口からCodex / Claude等で入れるようにする。

### Current

- GitHub本体あり
- AGENTS / CURRENT / DECISIONSあり
- Cloudflare入口は未実装

### Next deliverable

**Real Member 1人が認証し、MCP経由で `CURRENT.md` を読める最小PoC。**

### Boundary

- main直接編集を最初から許可しない
- 独自認証を先に作らない
- 大量のMCP toolsを一度に公開しない


---

## B. Real Member Onboarding

### Goal

新しい現実の人が、AIに詳しくなくてもAI通訳ラジオで小さな仕事を始められる状態にする。

### Current

- GitHub共有可能
- Onboarding draftあり
- Cloudflare入口はまだない

### Next deliverable

**一人が実際に参加し、小さな作業→PR→レビュー→Observationを一周する。**

### Boundary

- 人間を架空のActor化しない
- 最初から大量の資料を読ませない
- AI習熟度を評価する試験にしない


---

## C. Organization / World Model Seed

### Goal

Real Member → Seed → 必要ならActor、という運用を実際の仕事で検証する。

### Current

- 猫はBaseline Actor
- Opening由来の一般Seed候補あり
- Narrative Secret由来のSeed候補も存在する。存在・出典は見えてよいが、通常の作業では明示的な答え合わせを急がない
- 一般候補の詳細は未確定

### Next deliverable

**候補のうち必要になった1つだけに、責任Real Member・Boundary・Authorityを含む最小Seedを置き、実際の仕事を1回させる。Narrative Secret由来の場合はReveal Policyも一緒に確認する。**

### Boundary

- 組織図を埋めない
- 名前、性格、過去を先に完成させない
- 一度の行動からWorld Modelを確定しない


---

## D. 3D Presence

### Goal

内部メンバーが、誰がどこで何をしているかを感じ、話しかけやすくなるかを検証する。

### Current

- 本社平面図あり
- 旧3D試作あり
- Presence用実装なし

### Next deliverable

**2Fの一部を軽量Three.jsで歩けて、2つ以上の存在と状態ラベルが見える。**

### Boundary

- フォトリアルにしない
- 3Dを開かないと仕事できない設計にしない
- 音声、マルチプレイ、VRを最初から入れない
- 映像用高品質3DとPresence用軽量3Dを同一品質にしない


---

## E. HQ Spatial / Studio B / Media Assets

### Goal

本社の座標を基準に、複数アングルでも崩れないStudio Bを作り、映像素材にもPresenceにも利用できる空間基盤を育てる。

### Current

- 本社全体図あり
- 2F Bは表向きサブ収録用
- 詳細ブース図は未完成
- 旧生成素材は整理済み

### Next deliverable

**ユーザーが2F Bの詳細図を作成・確定し、その図を基準に正面・後方・左右・俯瞰で同じ配置が成立するブロックアウトを作る。**

### Boundary

- 2F B内部の詳細図はユーザーが作成する。AIは未確定部分を勝手に確定しない
- 旧生成画像から間取りを逆算しない
- 仕上げ品質より座標を先に確定
- 秘密設定を理由に表向きの部屋用途を変更しない


---

## F. Season 2 / Main Content

### Goal

Season 1から見た目も内容も一段変化させつつ、AI通訳ラジオ本編を継続する。

### Current

- Season 1完了
- Season 2 Opening試作から新しいSeed候補も発生
- 本社・3D素材が将来の演出候補になっている

### Next deliverable

テーマ、Opening、またはEpisodeのうち、その時点で最も進めやすい一つをレビュー可能な単位まで進める。

### Boundary

- 新システム完成をSeason 2開始条件にしない
- 3DやMCPを使うこと自体を目的にしない
- 1 Episodeの核心を一つに保つ


---

## G. Knowledge / Content from Operations

### Goal

実際の運営、失敗、発見をKnowledgeとAI通訳ラジオのネタへ変換する。

### Current

すでに以下の一次経験がある。

- AIが人間のレビュー速度を超える問題
- 生成画像の空間的不整合
- 3Dを最終絵ではなく座標基盤にする判断
- 不採用素材がAIを迷わせる問題
- 表 / 裏 / 秘密の情報分離
- Codex / Claude間の共通入口の必要性
- 3D Presenceによる孤独感・会話摩擦の仮説

### Next deliverable

**作業ログから1件を選び、「Observation → Knowledge候補 → コンテンツ候補」へ変換する。**

### Boundary

- 成功談だけにしない
- 実験前の期待を結果として書かない
- 企業向け導入効果や社会的効果を実証前に断定しない


---

## Shared review rule

各Workstreamは、次のどれかを満たしたら一度止めてレビューする。

- 新しい構造を1つ作った
- 新しい外部サービスを接続した
- 新しい権限を与える直前
- 代表サンプルが1つ動いた
- 人間が何が変わったか説明しにくくなってきた
- 別WorkstreamのSource of Truthを変更する必要が出た

**量産より先に、理解可能なチェックポイントを作る。**
