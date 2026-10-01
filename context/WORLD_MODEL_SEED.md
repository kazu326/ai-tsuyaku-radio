# WORLD MODEL SEED｜人間とAIエージェントが一緒に育つための基盤 v0.1

Status: Draft for review / 2026-10-02  
Scope: AI通訳ラジオ内部および将来の外部導入で使うWorldModelSeedの設計原則

## 1. 一言で言うと

**WorldModelSeedは、完成したAI社員や固定されたエージェントを配る仕組みではない。**

その人・その組織が持つ目的、知識、経験、権限、判断基準をもとに、実務を通してAIエージェントのWorld Modelを育て続けるための基盤である。

同じ基盤LLMを使っていても、全員が同じAgentになることを目指さない。

```text
Foundation Model
+
Organization Context
+
Role / Permission
+
Personal Context
+
Experience
+
Observation
+
Evaluation
=
その人・その組織に適応したAgent
```

ここでいうWorld Modelは、基盤モデルそのものの再学習を必須とする意味ではない。

AIが「この人・この組織では何を目指し、何を知り、どこまで実行でき、何を良い結果とするか」を継続的に判断できる状態を指す。

---

## 2. なぜSeedが必要か

従来のAIエージェントや「AI社員」は、作成時点では最適でも、

- 業務が変わる
- 人が変わる
- 例外が増える
- 社内Knowledgeが更新される
- 利用者の得意不得意が分かってくる
- 実際の運用で当初の想定と違うことが起きる

ことで、徐々に現実とずれる。

エンジニアはPrompt、Context、Tool、権限、Workflowなどを自分で直せる場合がある。

一方、非エンジニアは「使いづらくなった」という違和感があっても、どこを直せばよいか判断しにくい。

WorldModelSeedは、カスタマイズを導入時だけの作業にせず、**運用そのものを適応の循環にする。**

```text
Customize
  ↓
Use
  ↓
Observe
  ↓
Evaluate
  ↓
Adjust
  ↓
Use
  ↓
...
```

Agentを完成品として固定するのではなく、その人・組織の変化に合わせて育て続ける。

---

## 3. 既存Knowledgeを持つ組織と、これから経験を作る人の両方に使う

### 3.1 すでにKnowledgeを持つ組織

企業や既存チームには、すでに大量のContextがある。

例：

- 業務手順
- 過去案件
- 顧客対応の履歴
- 社内ルール
- 会議記録
- 成功例・失敗例
- ベテランの暗黙知
- 評価基準

ただし、それらはGitHub、Drive、Notion、Slack、PDF、人の頭の中などへ分散している場合がある。

この場合のSeedは、**すでに持っている世界をAIが判断に使える形へ変換する**役割を持つ。

### 3.2 まだKnowledgeを持たない新人・個人

新人や新しい分野へ挑戦する人は、最初から十分なContextを持っていなくてもよい。

```text
やりたいこと
  ↓
小さなExperiment
  ↓
調査
  ↓
実行
  ↓
成功 / 失敗
  ↓
Observation
  ↓
Seed更新
```

この場合のSeedは、**AIと一緒に世界を作っていく**役割を持つ。

---

## 4. AI通訳ラジオ内部での使い方

AI通訳ラジオでは、Real Memberに動画・記事・Web制作だけを求めない。

最初に問うのは、

**「AIを使って、何をやってみたいか？」**

である。

活動例：

- SNSを育てる
- AIアプリを作る
- 動画・記事を作る
- 商品を企画して外注する
- 3Dプリンターで試作品を作る
- AIを使って基板・筐体・ハードウェアを設計する
- 実際に組み立てて検証する
- ECで販売する
- クラウドファンディングを試す
- まだ知らない分野を探索する

成果物をAI通訳ラジオ内部だけで完結させる必要はない。

重要なのは、実際に試した一次体験から、

- 何をしようとしたか
- 何が起きたか
- どこで失敗したか
- どう修正したか
- 何が再利用できるKnowledgeになったか

を残すこと。

その経験は本人とAgentを育て、必要に応じてAI通訳ラジオの動画・記事・SNS・Knowledgeへ翻訳される。

---

## 5. Coreと個別World Modelを分ける

WorldModelSeedは、全員へ同じ完成済みAgentを配る仕組みにしない。

### Core

共通化できるのは主に「育て方」と安全な運用原則。

例：

- Intent
- Purpose / Boundary / Context / Authority / Evaluation
- Selector
- Task Contract
- Executor
- Challenge
- Observation
- Evaluation
- Update
- Provenance
- Human Approval

### Internal

AI通訳ラジオ内部では、概念的に次を組み合わせる。

```text
Core
+
AI通訳ラジオ Organization Context
+
Role / Permission
+
Personal Context
+
Experience
```

同じ組織のReal Memberでも、役割・権限・経験が違えば、Agentが参照する世界と行動可能範囲も違う。

### External

外部用Seedは内部Seedのコピーではない。

```text
Core
+
Client Organization Context
+
Client Role / Permission
+
Client Personal Context
+
Client Knowledge
+
Client Experience
+
Client Evaluation
```

顧客ごと、人ごとに構築する。

**External Seed is not a copy of Internal Seed.**

AI通訳ラジオ内部のKnowledgeをそのまま渡すことと、顧客専用Agentを育てることは別である。

---

## 6. Seedの基本ループ

```text
Intent
「何をしたい？」
  ↓
Explore
「何を試す？」
  ↓
Task Contract
「今回は何を成功とし、どこまでやる？」
  ↓
Selector
「判断に必要なContextは何？」
  ↓
Executor
「契約範囲内で実行」
  ↓
Challenge
「この境界では目的達成が難しい場合は異議を出す」
  ↓
Observation
「何が実際に起きた？」
  ↓
Evaluation
「良かったか、悪かったか、何が足りなかったか？」
  ↓
Update
「Contract / Knowledge / World Modelのどこを更新する？」
  ↓
Next Experiment
```

すべてのTaskで全工程を重く実装する必要はない。

簡単なTaskでは軽く、重要なTaskでは明示的に使う。

---

## 7. Task Contract

Task ContractはAIの推論手順を細かく固定するためではない。

最低限、必要に応じて次を持つ。

- Purpose — 何を成功とするか
- Boundary — 何を変えてよいか、何を越えてはいけないか
- Context — 何を判断材料として使えるか
- Authority — どこまで自分で実行してよいか
- Evaluation — 何をもって良い結果とするか
- Human Approval — どこで人間確認が必要か
- Unknown — 現時点で未決定のもの

既存の制約を「改善した方が良い」という理由でExecutorが勝手に破らない。

目的達成が難しい場合はChallengeとして表に出す。

---

## 8. Challenge

Challengeは失敗ではない。

次のような場合に使う。

- 現在のBoundaryでは目的達成が難しい
- 必要なContextへアクセスできない
- Authority不足で必要な操作ができない
- Evaluationが曖昧で良否を判定できない
- 過去のKnowledgeと現在のContractが矛盾している
- 新しい状況が既存の想定を超えた

Challengeを出したからといって、自動的に権限を広げない。

必要な変更はReal Memberまたは指定されたHuman Approval先で判断する。

---

## 9. ObservationからWorld Modelを育てる

一度の成功・失敗だけで大きなルールへ昇格させない。

```text
実行
 ↓
Observation
 ↓
再現するか確認
 ↓
Knowledge候補
 ↓
Human Review
 ↓
必要ならWorld Model更新
```

事実、解釈、仮説をできるだけ分ける。

失敗した場合も、

```text
失敗
 ↓
原因を特定
 ↓
どのContext / Boundary / Authority / Evaluationが不足していたか確認
 ↓
必要最小限を修正
```

とする。

---

## 10. 内部Seedと外部Seed

### Internal Seed

AI通訳ラジオ内部の活動に使う。

- 組織共通Knowledge
- Role別Knowledge
- 権限別Context
- Personal Context
- 実際の活動履歴

を必要な範囲で組み合わせる。

内部だからといって、すべての内部情報へアクセスできるわけではない。

### External Seed

企業・個人向けに構築する。

外部提供の価値は、共通Agentテンプレートを渡すことではない。

その企業・人が持つ、

- 目的
- 業務
- Knowledge
- 権限
- 評価基準
- 経験
- 変化

に合わせてSeedを作り、**利用者自身がAgentを育て続けられる状態を作ること**を目指す。

AI通訳ラジオ側だけが運用Knowledgeを持ち続け、顧客が毎回ベンダーへ修正を依頼しないと使えない構造を理想としない。

---

## 11. AI通訳ラジオとの循環

```text
Real Memberが参加
  ↓
やりたいことを決める
  ↓
Seed + AI AgentでExperiment
  ↓
本人とAgentが成長
  ↓
Observation / Knowledge
  ↓
AI通訳ラジオで発信
  ↓
新しい人・企業が知る
  ↓
参加 / 問い合わせ / 導入
  ↓
新しい経験
  ↓
KnowledgeとSeedがさらに育つ
```

AI通訳ラジオはメディアであると同時に、実践を通してAIエンジニアリング的な判断力を育てる組織を目指す。

---

## 12. 外部導入の基本思想

将来の企業・個人向け提供では、WorldModelSeedそのものを固定商品として配ることを目的にしない。

提供候補は、

- 現状観察
- Knowledge整理
- 権限設計
- Initial Seed構築
- Agent / Harness / MCP等の実装
- 実運用
- Observation収集
- Seed調整
- 利用者が自分で育てられる状態への移行

を組み合わせた個別導入パッケージ。

実際の商品形態、価格、契約、保守範囲は未決定。

内部運用で有効性を確認してから具体化する。

---

## 13. 非目標

WorldModelSeedは、現時点では次を意味しない。

- 全員へ同じAI社員を配る
- 一つの巨大Promptへ全情報を詰め込む
- すべての人を自動評価する
- 人間の性格や能力をAIが勝手に固定する
- すべてのObservationを自動的にKnowledgeへ昇格する
- 全情報を全Seedが共有する
- Foundation Modelを必ずFine-tuningする
- AI通訳ラジオ内部Knowledgeを顧客へそのまま複製する

---

## 14. 関連資料

- `context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actorの組織上の関係
- `context/KNOWLEDGE_MODEL.md` — KnowledgeのScope、権限、内部／外部境界
- `context/WORLD_MODEL_SEEDS.md` — 現在存在するSeed / Candidateの一覧
- `context/ACTOR_WORLD_MODEL.md` — Observation / Discovery / World Model育成の既存原則
- `docs/REAL_MEMBER_ONBOARDING.md` — 新規Real Memberの参加導線
- `docs/SYSTEM_ARCHITECTURE.md` — GitHub / Cloudflare / MCP等の技術構造
