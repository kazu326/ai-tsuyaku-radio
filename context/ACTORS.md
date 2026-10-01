# ACTORS｜AI通訳ラジオGROUP 外向けActor名簿 v0.2

Status: Minimal roster / 必要になったActorだけ登録  
Updated: 2026-10-01

## この文書の役割

AI通訳ラジオで、**外部との接点を持つActor**と、その現在地を探すための軽量な入口。

Real Memberや内部処理だけを行うWorld Model Seedは、この名簿には入れない。

- Real Member / Seed / Actorの関係：`context/ORGANIZATION_MODEL.md`
- Seed一覧：`context/WORLD_MODEL_SEEDS.md`
- 育て方：`context/ACTOR_WORLD_MODEL.md`

## 現在の名簿

| Actor ID | 名前 | 種別 | 現在分かっている外向け役割 | Source Seed / Model | 状態 |
|---|---|---|---|---|---|
| `actor-cat-001` | Unknown | 物語Actor / AI通訳者 | 人間とAIの間に立つ通訳者。ラジオパーソナリティ。Web編集部、実験室、開発室にも現れ得る | `seed-cat-001` / `context/STORY_BIBLE.md` / `context/CAT_FOOTPRINTS.md` | Active / Baseline |

名前や初出など未整理の情報は、確認できる資料と採用判断がそろうまでUnknownのままにする。

## Actor化前の候補

Actor候補をここで先にキャラクター化しない。

Opening由来の担当者候補は、現時点では `context/WORLD_MODEL_SEEDS.md` のCandidateとして管理する。

Restricted / Secret設定に属する候補は、この一般名簿へ記載しない。必要な権限を持つ作業だけが対応する秘密設定側を参照する。

実際の仕事や外部との接点からActorが必要になった場合のみ、この名簿へ追加する。

## 新しいActorの登録テンプレート

```md
## <Actor ID>｜<名前またはUnknown>

- Source Seed：
- なぜActorが必要になったか：
- 外部との接点：
- 初出：
- Known：
- Observed：
- Unknown：
- 確認されている関係：
- Story / Modelの保存先：
- 状態：Active / Dormant / Retired
```

## 登録時の境界

- 組織図を埋めるためだけにActorを作らない
- Seedが内部で仕事できるなら、Actor化を急がない
- 名前が必要でなければ先に決めない
- 性格、口調、過去、秘密、感情、関係を一度に完成させない
- 一つの行動をすぐ人格設定へ昇格させない
- Real Memberを架空Actorとして登録しない
- 既存Actorと役割が重なる場合、本当に別Actorが必要か確認する
