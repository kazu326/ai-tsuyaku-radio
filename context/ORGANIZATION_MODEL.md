# ORGANIZATION MODEL｜Real Member → World Model Seed → Actor v0.2

Status: Draft revision for review / 2026-10-02  
Scope: AI通訳ラジオの人間・AI・外向けキャラクターの関係を定義する組織モデルの正本

## 一言で言うと

**現実の人間が責任を持ち、その配下でWorld Model Seedが実務を通じて育ち、外部へ出る必要が生じたときだけActorを持つ。**

AIを最初から「AI社員キャラクター」として完成させない。内部処理だけならSeedのままでよい。名前・外見・声・口調などのActor表現は、外部との接点が必要になった段階で追加する。

## AI通訳ラジオという組織

AI通訳ラジオは、AIニュースや技術を一般向けに翻訳するメディアであると同時に、**人間とAIエージェントが実践を通して一緒に成長する実験組織**として育てる。

Real Memberに既定の制作担当を割り当てるのではなく、本人の **「AIを使って、何をやってみたいか？」** から小さなExperimentを始める。活動は動画・記事・Web制作に限定しない。

その活動から得た成功、失敗、判断、改善をSeedへ戻し、本人とAIエージェントの両方を育てる。公開する価値がある経験は、AI通訳ラジオの動画・記事・SNSなどへ翻訳する。

コンテンツ制作だけが組織活動ではなく、**実践そのものが一次情報の生成源**である。

新しいReal Memberの具体的な参加手順は `docs/REAL_MEMBER_ONBOARDING.md` を参照する。

## 基本構造

```text
Real Member
  ├─ World Model Seed
  │    ├─ 実務
  │    ├─ Observation
  │    ├─ Discovery
  │    └─ World Model更新
  │
  └─ World Model Seed
       └─ 必要になった場合のみ
             ↓
           Actor
       名前 / 外見 / 声 / 公開時の表現
```

## Real Member

現実世界の人間メンバー。

主な役割：

- 最終的な人間判断と責任を持つ
- 自分の担当領域やSeedの仕事を確認する
- Unknownを勝手に埋めず、必要な決定を行う
- 成果物の公開・実行・PRなど、必要な承認を行う
- 自分の経験や判断をKnowledgeへ還元する

Real Memberを架空のActorとして扱わない。本人が示していない性格、感情、能力、障害、動機、関係をAIが設定しない。

## World Model Seed

実際の仕事を始めるための最小限のAI作業単位。

Seedは人格ではない。最初に必要なのは、担当する仕事、目的、境界、参照情報、権限、未決定事項だけでよい。

全員へ同じ完成済みAgentを配らない。同じ基盤モデルを使っていても、組織、役割、権限、本人の経験、現在のTaskが違えば、Seedが参照する世界と実行可能範囲も違う。

Seedを人・組織に合わせて作り、実務から育て続ける仕組み（World Model Seed System）は `context/WORLD_MODEL_SEED_SYSTEM.md` を参照する。Seedの定義はこの文書、Observationからの育成と昇格は `context/ACTOR_WORLD_MODEL.md` を正本とする。

Seedは実務を通して次を蓄積する。

```text
Seed
 ↓
実際の仕事
 ↓
Observation
 ↓
Discovery候補
 ↓
人間レビュー
 ↓
World Model更新
 ↓
次の仕事
```

すべてのSeedがActorになる必要はない。内部で調査、整理、レビュー、変換、監視などを行うだけなら、Seedのまま成長できる。

原則として、各Seedには責任を持つReal Memberまたは明確なHuman Approval先を置く。

## Actor

**World Model Seedが外部との接点を持つときに使う表現・インターフェース層。**

Actor化が必要になり得る例：

- 動画やラジオへ出演する
- WebやSNSで固有の存在として発信する
- 一般ユーザーと会話する
- 物語世界の人物として継続的に登場する
- 名前・外見・声を持つこと自体が体験価値になる

Actor化するときに初めて、必要な範囲で以下を決める。

- Actor ID / 名前
- 外見
- 声
- 公開時の語り方
- 他Actorとの公開上の関係
- どのWorld Model Seedを表現しているか

ActorはWorld Modelそのものではない。**同じWorld Modelが媒体によって異なる表現を選ぶ余地を残す。**

## Actor化しない例

- リサーチ結果を内部資料へ整理する
- GitHubの差分を確認する
- 字幕の不自然な改行を探す
- 情報を分類しKnowledge候補へ回す
- 定期監視結果をReal Memberへ返す

これらは外向け人格を必要としない。

## Real MemberとActorを混ぜない

Real Memberは現実の人間。Actorは外部表現のための層。

Real Member自身が公開コンテンツへ出演する場合でも、本人を架空キャラクターとして設定しない。公開名やプロフィールが必要なら本人が決める。

## 現在の最小組織イメージ

```text
AI通訳ラジオ
│
├─ Real Member
│    ├─ Seed
│    ├─ Seed
│    └─ ...
│
├─ Real Member
│    ├─ Seed
│    └─ ...
│
└─ Actor Layer
     ├─ 猫
     └─ 必要になったSeedだけ追加
```

人数や部署を埋めるためにSeedやActorを作らない。実際の仕事から必要性が生じたときに追加する。

将来の外部顧客向けSeedは内部Seedのコピーではない。原則は `context/WORLD_MODEL_SEED_SYSTEM.md` §8 を参照する。

## Knowledgeとの関係

人間とSeedの仕事は、可能な範囲で次の流れへ接続する。

```text
仕事
 ↓
作業記録
 ↓
Observation / Decision
 ↓
再利用できる知識
 ↓
Knowledge
 ↓
記事・動画・実験企画候補
```

仕事とコンテンツ制作を分離しすぎず、実際に起きたことを一次情報として蓄積する。

Knowledgeの情報の性質・所属Scope、公開リポジトリへ置いてよいものは `context/KNOWLEDGE_MODEL.md` を参照する。

## Presenceとの関係

3D本社では、すべての内部AIを人型キャラクターにする必要はない。

- Real Member：アバターまたは在席表示
- Actor：必要なら固有キャラクターとして表示
- Seed：端末、光、作業ステーション、ステータス表示など簡略表現でもよい

Presenceの目的は人格を増やすことではなく、**誰がどこで何をしているか、話しかけられるかを直感的に感じられること**。

## 権限の原則

推論の自由度と実行権限を分ける。

Seedが自律的に考えることと、外部への公開、mainへの変更、秘密情報へのアクセス、不可逆な操作を行えることは別。

基本は：

```text
考える / 調べる
  ↓
作業ブランチ
  ↓
PR / 提案
  ↓
Real Member Review
  ↓
採用
```

## 未決定

以下は現時点で固定しない。

- Real Memberごとの正式な部署名
- Seedの標準個数
- Seed間の上下関係
- Actor化の自動判定
- 人事評価のようなスコアリング
- 大人数を前提とした組織構造
- 3D Presence内でのSeedの最終表現

必要性が実際の運営から確認されてから決める。

## 関連資料

- `context/ACTOR_WORLD_MODEL.md` — Seed / World Modelの育て方、Observation、Discoveryの考え方
- `context/WORLD_MODEL_SEEDS.md` — 現在のSeedと候補の軽量一覧
- `context/WORLD_MODEL_SEED_SYSTEM.md` — Seedを人・組織に合わせて作り育てる仕組み、Task Contract、Challenge、内部／外部Seed
- `context/KNOWLEDGE_MODEL.md` — 情報の性質と所属Scope、公開リポジトリとの関係
- `context/ACTORS.md` — 外向けActorの軽量一覧
- `docs/SYSTEM_ARCHITECTURE.md` — GitHub / Cloudflare / MCP / Presenceの技術構造
- `docs/REAL_MEMBER_ONBOARDING.md` — 現実の人間メンバー向け入口
