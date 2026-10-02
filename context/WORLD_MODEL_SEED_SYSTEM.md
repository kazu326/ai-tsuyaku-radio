# WORLD MODEL SEED SYSTEM｜Seedを人・組織に合わせて作り、実務から育て続ける仕組み v0.2

Status: Adopted / 2026-10-02  
Scope: AI通訳ラジオ内部および将来の外部導入で、World Model Seedをどう個別化し、どう育て続けるかの設計原則

## 1. 用語

| 用語 | 意味 | 正本 |
|---|---|---|
| World Model Seed | 個別に存在し、実務を通して育つ最小限のAI作業単位。`seed-cat-001` など | `context/ORGANIZATION_MODEL.md`（一覧は `context/WORLD_MODEL_SEEDS.md`） |
| World Model Seed System | そのSeedを個人・組織に合わせて作り、実務から育て続ける仕組み | この文書 |
| World Model | 実際の経験から蓄積され、複数の仕事で確認された判断原理 | `context/ACTOR_WORLD_MODEL.md` |
| Task Contract | 今回の仕事だけに適用する一時的な契約 | この文書 §5 |

この文書はSeedとWorld Modelを再定義しない。表記は「World Model Seed System」で統一し、連結表記は使わない。

ここでいうWorld Modelは、基盤モデルの再学習を必須とする意味ではない。

## 2. 一言で言うと

**World Model Seed Systemは、完成したAI社員を全員へ配る仕組みではない。**

同じ基盤モデルを使っていても、組織、役割、権限、本人の経験、現在のTaskが違えば、Seedが参照する世界と実行できる範囲は違う。

AIエージェントは、作った時点では合っていても、業務・人・例外・Knowledgeが変わるにつれて現実とずれる。カスタマイズを導入時だけの作業にせず、**運用そのものを適応の循環にする。**

## 3. 共通にするもの・個別にするもの

共通にするのは「育て方」と安全な運用原則だけ。

- Task Contract（§5）
- Challenge（§6）
- Observationからの更新（§7、詳細は `context/ACTOR_WORLD_MODEL.md`）
- Human Approval
- Knowledgeの扱い（`context/KNOWLEDGE_MODEL.md`）

個別にするのは、Seedが参照する世界そのもの。

```text
World Model Seed System（共通の育て方）
+ 組織のContext
+ Role / Project
+ Permission
+ Personal Context
+ Experience / Evaluation
+ 今回のTask Contract
= そのSeedが今回参照する世界
```

すべての層を毎回読み込まない。今回のTaskに必要で、かつ権限のある範囲だけを使う。

## 4. 2つの始まり方

### すでにKnowledgeを持つ組織・人

業務手順、過去案件、評価基準、ベテランの暗黙知などが、GitHub・Drive・Slack・人の頭の中などに分散している。

この場合のSeedは、**すでにある世界をAIが判断に使える形へ変換する**ところから始める。

### まだKnowledgeが少ない新人・個人

最初から十分なContextがなくてよい。

```text
やりたいこと → 小さなExperiment → 実行 → Observation → Seed更新
```

この場合のSeedは、**AIと一緒に経験から世界を作っていく。**

AI通訳ラジオ内部では、Real Memberの「AIを使って何をやってみたいか」から始める（`context/ORGANIZATION_MODEL.md`、`docs/REAL_MEMBER_ONBOARDING.md`）。

## 5. Task Contract

Task Contractは、今回の仕事だけに適用する一時的な契約。AIの推論手順を細かく固定するためのものではない。

必要に応じて次を持つ。

- Purpose — 今回何を成功とするか
- Boundary — 何を変えてよいか、何を越えてはいけないか
- Context — 何を判断材料にしてよいか
- Authority — AIがどこまで自分で実行してよいか
- Evaluation — 何をもって良い結果とするか
- Human Approval — どこで人間の確認が必要か
- Unknown — まだ決まっていないこと

小さなTaskなら数行でよい。重要なTaskほど明示する。

`context/WORLD_MODEL_SEEDS.md` のテンプレートはSeedに常設する設定であり、Task Contractとは別。`docs/SYSTEM_ARCHITECTURE.md` §7のTask Contractは、この定義をContext選択に使う例。

実行するAIは、既存の制約を「改善した方が良い」という理由で勝手に破らない。

## 6. Challenge

通常の流れは「実行 → Observation」。Challengeは、契約に問題が見つかったときだけの分岐。

```text
Task Contract
  ↓
実行 ─────────────→ Observation → 評価 → 必要なら更新（§7）
  │
  └─ 今の契約では目的達成が難しいと分かった場合だけ
       ↓
     Challenge（理由を添えて提示）
       ↓
     Real Member / Human Approval先が判断
       ↓
     Task Contractを見直して再開
```

Challengeを出す例：

- 必要なContextへアクセスできない
- Authorityが足りない
- Boundaryの内側では目的達成が難しい
- Evaluationが曖昧で良否を判断できない

Challengeは失敗ではない。ただし、Challengeを出しただけで権限や範囲を広げない。

## 7. 経験からの更新

Observation → Discovery → World Model の流れと昇格条件は `context/ACTOR_WORLD_MODEL.md` を正本とする。

この仕組みで加えるのは次の2点だけ。

1. **更新先を見分ける。** 今回のTask Contractだけの問題か、Seedの常設設定（Boundary、Authority等）か、Knowledgeか、World Modelか。失敗したときは、どのContext / Boundary / Authority / Evaluationが不足していたかを確認し、必要最小限だけ直す。
2. **共有する前にKnowledgeの扱いを確認する。** 個人や特定Projectの経験を組織全体へ戻す場合は、`context/KNOWLEDGE_MODEL.md` の「情報の性質」と「所属Scope」を確認する。

## 8. 内部Seedと外部Seed

### 内部Seed

AI通訳ラジオ内部の活動に使う。内部メンバーだからといって、すべての内部Knowledgeへアクセスできるわけではない。

### 外部Seed

将来、企業・個人向けに提供する場合の原則。

1. **内部Seedをコピーして提供しない。**
2. **顧客・個人ごとに個別化する。**
3. **顧客がすでに持つKnowledgeを初期資産として活用する。**
4. **顧客側に、自分たちのSeedを育て続ける能力とKnowledgeを残す。** 顧客が毎回ベンダーへ修正を依頼しないと使えない構造を理想としない。
5. **Client間でKnowledgeを混ぜない。**

導入フロー、商品形態、価格、契約、保守範囲は未決定。内部運用で有効性を確認してから具体化する。事業仮説としての位置づけは `context/VISION.md` を参照する。

## 9. 現時点で作らないもの

`context/ACTOR_WORLD_MODEL.md` の「現時点で作らないもの」に加えて、次を作らない。

- 全員共通の完成済みAgent
- 一つの巨大Promptへすべての情報を詰め込む構成
- 基盤モデルのFine-tuningを前提とした設計
- Task Contractの専用フォーマットや管理システム
- 外部提供用のパッケージ・価格表

## 10. 関連資料

- `context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actorの定義
- `context/ACTOR_WORLD_MODEL.md` — Observation / Discovery / World Modelの育て方と昇格条件
- `context/WORLD_MODEL_SEEDS.md` — 現在存在するSeed / Candidateの一覧
- `context/KNOWLEDGE_MODEL.md` — 情報の性質と所属Scope、公開リポジトリとの関係
- `docs/REAL_MEMBER_ONBOARDING.md` — 新規Real Memberの参加手順
