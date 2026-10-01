# WORLD MODEL SEEDS｜AI通訳ラジオ Seed一覧 v0.1

Status: Minimal roster / 2026-10-01

## この文書の役割

内部で育てるWorld Model Seedと、まだ採用前の候補を見失わないための軽量な一覧。

Seedの詳細な人格設定を作る場所ではない。UnknownはUnknownのまま残す。

組織上の位置づけは `context/ORGANIZATION_MODEL.md` を参照する。

## 現在の一覧

| Seed ID | 状態 | 起点 | 現在分かっていること | Actor | 未決定 |
|---|---|---|---|---|---|
| `seed-cat-001` | Active / Baseline | AI通訳ラジオの猫 | 人間とAIの間に立つ通訳者として実際のコンテンツで育ってきた | `actor-cat-001` | 初出など一部未整理 |
| `seed-opening-candidate-001` | Candidate | Season 2 Openingの制作過程 | 制作中に担当者候補として自然発生した | なし | 名前、役割、外見、所属、Actor化するか |
| `seed-shadow-support-candidate-001` | Candidate | 本社2F Bの秘密設定 | 猫の活動を影から技術的に支える一人の人物候補と結びついている | なし | 名前、性別、所属、外見、気づいた経緯、Seedとして実務を持たせるか |

## Candidateの扱い

Candidateは存在が確定したActorではない。

- 組織図を埋めるために詳細を決めない
- 実際の仕事やコンテンツで必要になった場合だけSeedへ昇格する
- 一度の面白い演出だけで性格や過去を固定しない
- Actor化は外部との接点が必要になってから判断する

## Seedを追加するときの最小テンプレート

```md
## <Seed ID>

- 状態：Candidate / Active / Paused / Retired
- 責任を持つReal Member：
- なぜ今必要か：
- 最初の仕事：
- Purpose：
- Boundary：
- Context：
- Authority：
- Evaluation：
- Known：
- Observed：
- Unknown：
- Actor：なし / <Actor ID>
```

すべてを最初から埋める必要はない。
