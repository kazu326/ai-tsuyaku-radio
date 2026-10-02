# KNOWLEDGE MODEL｜情報の性質と所属Scope v0.2

Status: Draft for review / 2026-10-02  
Scope: Knowledgeを、誰が・どのSeedが・何の目的で扱えるかを判断するための2軸

## 1. 一言で言うと

**Knowledgeが存在すること、AIが取得できること、今回の判断に使えること、外部へ出してよいことは同じではない。**

そして、**Scopeを書いたからといって、アクセス制御されたことにはならない。**

## 2. 2つの軸

Knowledgeは2つの独立した軸で見る。

### 軸1：情報の性質

正本は `docs/SYSTEM_ARCHITECTURE.md` §7 Information classes。この文書では再定義しない。

- `public` — 公開してよい
- `internal` — 通常の内部作業で使う
- `narrative_secret` — 物語上の秘密。主に公開時の答え合わせを制限する
- `protected_information` — 現実にアクセス制御が必要（認証情報、個人情報、契約情報など）

### 軸2：所属Scope（誰の世界に属するか）

- organization — AI通訳ラジオ全体
- role / project — 特定の役割・担当・Project
- personal — 特定のReal Member本人
- client — 特定の顧客・契約・導入環境

具体的なRole名・Project名は、運用で必要性が確認されてから決める。

### 2軸の組み合わせ

```text
顧客Aの契約書
  情報の性質：protected_information
  所属Scope：client-A

猫の真相に関する設定
  情報の性質：narrative_secret
  所属Scope：organization

本人が公開してよいと判断したExperimentの記録
  情報の性質：public
  所属Scope：personal
```

personalやclientだからprotected_informationとは限らない。逆も同じ。両方を確認する。

どちらの軸の値も、現時点ではfrontmatterやコード上の識別子として固定しない。

## 3. 公開リポジトリとの関係

**このリポジトリは公開されている。** Gitにはファイル単位のアクセス制御がない。

- このリポジトリに置いたものは、ラベルに関係なく誰でも読める前提で扱う
- 次のものはこのリポジトリへ置かない
  - `protected_information`
  - personal Scopeのうち、本人が公開を了承していないもの
  - client Scopeのうち、公開許可を得ていないもの
- これらの保存先は `docs/SYSTEM_ARCHITECTURE.md` の Protected Information storage に従う
- role / projectは「誰向けの情報か」を示す目印であり、閲覧制限ではない

## 4. Retrieval / Use / Disclosure

- **Retrieval** — Agentがその情報を取得できるか
- **Use** — 取得した情報を、今回のTaskの判断材料にしてよいか
- **Disclosure** — 成果物、外部通信、公開コンテンツへ出してよいか

既存の `docs/SYSTEM_ARCHITECTURE.md` でいえば、`narrative_secret` は主にDisclosureを制限し、`protected_information` はRetrievalから制限する。

```text
制作レビュー中のAgent
  → world/HQ_SECRET.md をRetrievalできる
  → 内部レビューの判断にUseできる
  → 公開記事で真相をDisclosureしない
```

Taskに必要なContextを選ぶときは、権限のないContextを候補に入れない。

## 5. 組織全体のKnowledgeへ戻すとき

個人の活動、特定Project、顧客案件から得た経験を、organization Scopeへ戻す場合に確認する。

昇格の手順と条件そのものは `context/ACTOR_WORLD_MODEL.md` に従う。

### 戻せる可能性がある

- 特定の顧客や個人を識別できない、一般化された設計パターン
- 再現性のある技術的知見
- 公開許可を得た事例
- AI通訳ラジオ内部で独自に検証した方法

### 原則としてそのまま戻さない

- 顧客固有のデータ・内部手順・成果物
- 契約・価格・認証情報
- 個人の非公開情報
- 他社へ転用すると競争上・契約上の問題になる情報

必要に応じて、匿名化・一般化・Human Reviewを行う。

## 6. Personal Knowledge

Personal Knowledgeは、本人に合ったSeedを育てるための資産。ただし「本人について何でも推測してよい」という意味ではない。

- 扱うのは、本人が明示した目標や好み、実際に行った作業、実測された結果、本人の評価など、活動から確認できるものだけ
- 個人の性格・能力・感情・健康・事情をAIが推測して追加しない
- Personal Knowledgeを組織評価や人事スコアへ転用しない
- 本人が公開を了承していないものは、このリポジトリへ置かない（§3）

## 7. 未決定

- 正式なRole / Project一覧と、それぞれの権限
- personal / client Knowledgeの非公開保存先
- 2軸を記録する形式（frontmatter、Database等）
- 匿名化の方法

実運用とレビューから決める。

## 8. 関連資料

- `docs/SYSTEM_ARCHITECTURE.md` — Information classes / Protected Information storage
- `context/WORLD_MODEL_SEED_SYSTEM.md` — Seedを個別化し育てる仕組み
- `context/ACTOR_WORLD_MODEL.md` — Observationからの昇格条件
- `context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actor
