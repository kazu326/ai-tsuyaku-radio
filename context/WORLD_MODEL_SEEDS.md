# WORLD MODEL SEEDS｜AI通訳ラジオ Seed一覧 v0.3

Status: Adopted minimal roster / 2026-10-01

## この文書の役割

通常の組織作業で参照できるWorld Model Seedと、まだ採用前の候補を見失わないための軽量な一覧。

Narrative Secret由来のSeed候補は、存在と出典だけ一般一覧へ記載してよい。具体的な真相は対応する世界設定側で管理する。Protected Information（保護情報）は、この一覧へ載せない。

Seedの詳細な人格設定を作る場所ではない。UnknownはUnknownのまま残す。

組織上の位置づけは `context/ORGANIZATION_MODEL.md` を参照する。

責任Real Memberは役職名だけではなく、GitHub handleや安定したmember IDなど、一意に特定できる識別子で記録する。

## 現在の一覧

| Seed ID | 状態 | 責任を持つReal Member | 起点 | 現在分かっていること | Actor | 未決定 |
|---|---|---|---|---|---|---|
| `seed-cat-001` | Active / Baseline | `@kazu326` (Project Lead) | AI通訳ラジオの猫 | 人間とAIの間に立つ通訳者として実際のコンテンツで育ってきた | `actor-cat-001` | 初出など一部未整理 |
| `seed-opening-candidate-001` | Candidate | Unassigned until activation | Season 2 Openingの制作過程（元記録リンク未収録） | 制作中に担当者候補として自然発生した | なし | 名前、役割、外見、所属、Actor化するか |
| `seed-narrative-secret-hq-001` | Candidate / Narrative Secret | Unassigned until activation | `world/HQ_SECRET.md` | Narrative Secret由来の人物候補が存在する | なし | 詳細はNarrative Secret側で管理 |

## Activeへ移す前の最低条件

CandidateをActiveへ移す前に、最低限次を明示する。

- 責任を持つReal Member
- Purpose
- Boundary
- Authority
- Human Approval / Evaluation
- Source record / provenance（元記録が存在する場合はリンクする。未収録なら未収録と明示する）

これらが未設定のCandidateへ、自律的な外部実行権限を与えない。

## Candidateの扱い

Candidateは存在が確定したActorではない。

- 組織図を埋めるために詳細を決めない
- 実際の仕事やコンテンツで必要になった場合だけActive Seedへ昇格する
- 一度の面白い演出だけで性格や過去を固定しない
- Actor化は外部との接点が必要になってから判断する
- Narrative Secret由来の候補は、存在・出典・状態までは露出してよい。ただし通常一覧で真相を説明しすぎない

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

Candidateでは未決定項目をUnknownのまま残せる。ただしActive化する場合、責任者・Boundary・Authority・Human Approvalを未設定のままにせず、元になったObservationや制作記録がある場合は追跡できる形にする。
