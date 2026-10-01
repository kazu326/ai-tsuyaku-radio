# KNOWLEDGE MODEL｜WorldModelSeedの知識・権限・共有境界 v0.1

Status: Draft for review / 2026-10-02  
Scope: AI通訳ラジオ内部と将来の外部導入で、Knowledgeを誰が・どのSeedが・何の目的で扱えるかを整理する

## 1. 一言で言うと

**Knowledgeが存在すること、AIが取得できること、AIが利用できること、外部へ出してよいことは同じではない。**

WorldModelSeedでは、Knowledgeの価値を高めながら、必要以上に全員・全Agentへ共有しない。

---

## 2. なぜKnowledge Scopeが必要か

AIエージェントが強くなるほど、Contextの量だけでなく「適切なContextへ適切な権限でアクセスできるか」が重要になる。

AI通訳ラジオ内部でも、

- 全Real Memberが知ってよい情報
- 特定の役割だけが必要な情報
- 本人専用の情報
- 顧客案件の情報
- 現実に保護が必要な情報

は異なる。

外部顧客でも同じで、部署・役割・人によって必要なWorld Modelは違う。

権限は単なる「ファイルが開けるか」だけではなく、**Agentがどの世界を前提として判断するか**を決める。

---

## 3. 基本Scope

初期分類として次を使う。

### PUBLIC

外部公開可能。

例：

- 公開済み記事
- 公開済み動画
- 公開ブランド情報
- 公開ドキュメント

### INTERNAL_SHARED

AI通訳ラジオの通常内部作業で共有できる。

例：

- 一般的な制作Knowledge
- 社内Workstream
- 内部向け手順
- 再利用可能な失敗・改善記録

### ROLE_SCOPED

特定の役割・担当・プロジェクトだけが必要。

例：

- 特定案件の作業Context
- Lead向けレビュー情報
- 特定制作チームの内部資料

実際のRole名は運用から必要性が確認されてから定義する。

### PERSONAL

Real Member本人と、その本人を支援する許可されたAgentが扱う。

例：

- 個人の作業履歴
- 本人が明示した好み
- 本人専用の学習履歴
- 本人のAgentを調整するためのContext

個人の性格・能力・感情・健康・事情をAIが推測して追加しない。

### CLIENT

特定顧客・特定契約・特定導入環境だけで扱う。

Client AのKnowledgeをClient BのAgentへ流さない。

AI通訳ラジオ内部で得た汎用的な実装知識と、顧客固有情報を分離する。

### PROTECTED

認証情報、個人情報、契約情報その他、現実にアクセス制御が必要な情報。

Protected Informationの保存先と実装上の扱いは `docs/SYSTEM_ARCHITECTURE.md` を参照する。

---

## 4. Narrative Secretは別軸

Narrative Secretは物語上のReveal Policy。

Protected Informationとは別。

```text
Narrative Secret
= 知っていてもよいが、公開時に答え合わせしない場合がある

Protected Information
= 権限がなければ取得・利用・出力しない
```

Narrative Secretを理由に、現実のセキュリティ情報を同じ扱いにしない。

---

## 5. Retrieval / Use / Disclosureを分ける

Knowledgeには少なくとも次の3段階を区別する。

### Retrieval

Agentがその情報を取得できるか。

### Use

取得した情報を現在のTaskの判断材料として使ってよいか。

### Disclosure

その情報を成果物、外部通信、公開コンテンツへ出してよいか。

例：

```text
制作レビューAgent
  → HQ_SECRETをRetrievalできる
  → 内部レビューではUseできる
  → 公開記事へ真相をDisclosureしない
```

---

## 6. Internal Seedの構成

内部Seedは概念的に次の層を組み合わせる。

```text
Core
+
Organization
+
Role / Project Scope
+
Permission
+
Personal
+
Task Context
```

すべてのSeedへOrganization全体を常時読み込ませない。

SelectorはTaskに必要なContextだけを選ぶ。

権限のないContextは、Selectorの候補に入れない。

---

## 7. External Seedの構成

外部Seedは顧客専用に構築する。

```text
WorldModelSeed Core
+
Client Organization
+
Client Knowledge
+
Client Role
+
Client Permission
+
Client Personal Context
+
Client Experience
+
Task Context
```

### 原則

- AI通訳ラジオ内部Seedをそのまま複製しない
- Client AのContextをClient Bへ共有しない
- 個人Agentは会社全体のKnowledgeへ無制限アクセスさせない
- 顧客がすでに持つ社内Knowledgeを重要な初期資産として扱う
- 導入後のObservationを、その顧客のWorld Modelへ戻せる構造を作る
- 顧客が自分のAgentを育て続けられることを目標にする

---

## 8. 共通知識へ戻せるもの・戻せないもの

顧客案件や個人活動から得た経験のすべてを、AI通訳ラジオ共通知識へ戻してよいわけではない。

### 戻せる可能性がある

- 特定顧客を識別できない一般化された設計パターン
- 再現性のある技術的知見
- 公開許可を得た事例
- AI通訳ラジオ内部で独自に検証した方法

### 原則としてそのまま戻さない

- 顧客固有データ
- 顧客内部手順
- 契約・価格・認証情報
- 個人の非公開情報
- 顧客が権利を持つ成果物
- 他社へ転用すると競争上・契約上問題になる情報

汎用Knowledgeへ昇格する場合は、必要に応じて匿名化・一般化・Human Reviewを行う。

---

## 9. ObservationからKnowledgeへの昇格

```text
Observation
  ↓
Candidate
  ↓
Scope判定
  ↓
Provenance確認
  ↓
再現性 / 有用性を確認
  ↓
Human Review
  ↓
Knowledge
```

一度の出来事を自動的に組織全体のルールへしない。

反証や例外が出た場合も削除せず、必要なら適用条件を更新する。

---

## 10. Personal Knowledge

Personal Knowledgeは、個人専用Agentを強くする重要な資産。

ただし「本人について何でも推測してよい」という意味ではない。

保存候補は、

- 本人が明示した目標
- 本人が選んだ作業方法
- 本人が実際に行った作業
- 実測された成功・失敗
- 本人が残した評価
- 本人が保存を許可したPreference

など、業務・活動から確認できる情報を中心にする。

個人Knowledgeを組織評価や人事スコアへ自動転用しない。

---

## 11. 既存Knowledgeが強い組織の扱い

企業導入では、最初に新しいAgentを作ることより、

**すでに存在するKnowledgeを発見・分類・接続すること**

が価値になる場合がある。

```text
既存資料
+
過去事例
+
暗黙知
+
権限体系
+
評価基準
  ↓
Initial Organizational World Model
```

導入後は、

```text
Initial World Model
  ↓
実運用
  ↓
Observation
  ↓
更新
```

へ移る。

---

## 12. Knowledgeの所有とProvenance

可能な範囲で、

- どこから来たか
- 誰が確認したか
- どのScopeか
- いつ有効だったか
- 現在も有効か
- 外部利用可能か

を追跡できる形を目指す。

すべてを初期から厳密なDatabase Schemaへ固定する必要はない。

必要性が確認された部分から構造化する。

---

## 13. 未決定

現時点では次を固定しない。

- 正式な社内Role一覧
- Roleごとの具体的権限表
- Knowledge管理Database
- Client間で共有可能な汎用Knowledgeの法的定義
- Personal Seedの保存期間
- 自動匿名化の仕組み
- Knowledge昇格の自動スコア
- 外部商品としての契約・価格・保守範囲

実運用とレビューから決める。

---

## 14. 関連資料

- `context/WORLD_MODEL_SEED.md` — Seed全体の設計原則
- `context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actor
- `docs/SYSTEM_ARCHITECTURE.md` — Identity / Information classes / Protected Informationの技術設計
- `docs/REAL_MEMBER_ONBOARDING.md` — 新規Real Memberの参加導線
