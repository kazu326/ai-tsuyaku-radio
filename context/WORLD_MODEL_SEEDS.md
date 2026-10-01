# WORLD MODEL SEEDS｜AI通訳ラジオ Seed一覧 v0.2

Status: Adopted minimal roster / 2026-10-01

## この文書の役割

通常の組織作業で参照できるWorld Model Seedと、まだ採用前の候補を見失わないための軽量な一覧。

**Restricted / Secret設定に属するSeed候補は、この一般一覧へ記載しない。** 必要な権限を持つ作業だけが、対応する秘密設定側を参照する。

Seedの詳細な人格設定を作る場所ではない。UnknownはUnknownのまま残す。

組織上の位置づけは `context/ORGANIZATION_MODEL.md` を参照する。

## 現在の一覧

| Seed ID | 状態 | 責任を持つReal Member | 起点 | 現在分かっていること | Actor | 未決定 |
|---|---|---|---|---|---|---|
| `seed-cat-001` | Active / Baseline | Project Lead / Real Member | AI通訳ラジオの猫 | 人間とAIの間に立つ通訳者として実際のコンテンツで育ってきた | `actor-cat-001` | 初出など一部未整理 |
| `seed-opening-candidate-001` | Candidate | Unassigned until activation | Season 2 Openingの制作過程 | 制作中に担当者候補として自然発生した | なし | 名前、役割、外見、所属、Actor化するか |

## Activeへ移す前の最低条件

CandidateをActiveへ移す前に、最低限次を明示する。

- 責任を持つReal Member
- Purpose
- Boundary
- Authority
- Human Approval / Evaluation

これらが未設定のCandidateへ、自律的な外部実行権限を与えない。

## Candidateの扱い

Candidateは存在が確定したActorではない。

- 組織図を埋めるために詳細を決めない
- 実際の仕事やコンテンツで必要になった場合だけActive Seedへ昇格する
- 一度の面白い演出だけで性格や過去を固定しない
- Actor化は外部との接点が必要になってから判断する
- Restricted / Secret由来の候補を一般一覧へ露出しない

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
- Human Approval / Evaluation：
- Known：
- Observed：
- Unknown：
- Actor：なし / <Actor ID>
```

Candidateでは未決定項目をUnknownのまま残せる。ただしActive化する場合、責任者・Boundary・Authority・Human Approvalは未設定のままにしない。
