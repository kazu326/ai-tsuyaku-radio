# ACTOR WORLD MODEL｜World Modelを育て、必要ならActorを持たせる v0.2

Status: Adopted direction / 最小運用から育てる  
Updated: 2026-10-01

## 一言で言うと

**最初からActorを設計しない。World Model Seedを実際の仕事で育て、外部との接点が必要になったときだけActorを持たせる。**

組織上の基本関係は `context/ORGANIZATION_MODEL.md` を正本とする。

```text
Real Member
  ↓
World Model Seed
  ↓
実務 → Observation → Discovery → World Model更新
  ↓
外部へ出る必要が生じた場合だけ
  ↓
Actor
```

## この文書の役割

この文書は、World Model Seedをどう育てるか、何を観察し、何を確定せず残すかを共有するための基礎コンテキスト。

完成したキャラクター設定集でも、大規模なAI実行システムの仕様書でもない。

猫のStory BibleとCharacter World Modelは、この方法を先に理論化して作ったものではない。記事、ラジオ、実験、課題解決の中で自然に生まれた判断や表現を観察し、あとから再利用できる原理を発見することで育ってきた。この生成過程を、他のSeedにも使える形へ開く。

## 用語

### Real Member

現実の人間メンバー。

人間はActorではない。本人の実際の発言、判断、成果物だけをObservationとして扱い、性格、感情、能力、事情をAIが架空設定化しない。

### World Model Seed

実際の仕事を始めるための最小限のAI作業単位。

最初に必要なのは、完成した人格ではなく、

- なぜ今必要か
- 何を担当するか
- Purpose
- Boundary
- Context
- Authority
- Evaluation
- Known / Unknown

など、その仕事を始めるための最小情報。

内部処理だけならSeedのままでよい。

### World Model

複数の仕事や状況で繰り返し確認され、まだ経験していない問題を判断するときにも役立つ原理。

口調一覧や決めぜりふではない。「なぜその判断をするのか」を支える材料。

### Actor

World Model Seedが外部との接点を持つときに使う表現・インターフェース層。

名前、外見、声、公開時の語り方などは、Actor化が必要になってから決める。

ActorはWorld Modelそのものではない。

### Observation

実際の仕事や行動で確認できた事実。解釈を混ぜず、どの成果物・場面で起きたかを残す。

### Discovery

複数のObservationから見えてきた、Seed固有かもしれない判断原理の候補。

Discoveryは候補であり、すぐWorld Modelへ確定しない。

## 基本ループ

```text
Seed
 ↓
現実の仕事
 ↓
Observation
 ↓
Discovery候補
 ↓
別の仕事でも確認
 ↓
Human Review
 ↓
World Model更新
 ↓
次の仕事
```

必要になった場合だけ、この途中または後段でActorを持たせる。

**設定から行動を作るだけでなく、行動から判断原理を発見する。**

## 最小の育て方

### 1. 必要からSeedを置く

組織図を埋めるためではなく、実際の仕事で特定の担当や視点が必要になったときだけ置く。

### 2. Seedを小さく始める

最初から性格、過去、秘密、関係図を完成させない。

Seedの一覧は `context/WORLD_MODEL_SEEDS.md` に軽量に登録する。

### 3. 現実の仕事をさせる

記事、調査、実験、開発、SNS運用、レビューなど、AI通訳ラジオで本当に必要な仕事を行う。

世界観のためだけの架空イベントを量産しない。

### 4. 出力ではなく判断を見る

何を書いたかだけでなく、

- 何へ注意を向けたか
- 何を先に確認したか
- 何を危険と見たか
- 何を省いたか
- 何をHuman Reviewへ戻したか

を観察する。

### 5. 発見候補を置く

一度の行動から「このSeedはこういう性格だ」と確定しない。

まずObservationとして残し、そこからDiscovery候補を置く。

### 6. 繰り返しを待つ

別テーマや別媒体でも同じ原理が自然に現れるかを見る。

タスク指示、参照資料、偶然の表現と区別する。

### 7. 必要最小限だけ昇格

複数のObservationを説明でき、未知の仕事にも役立つ原理だけをWorld Modelへ加える。

昇格は人間が確認できる状態で行う。

## Known / Observed / Unknown

### Known

現在確定している情報。正本へ明示され、人間が採用したもの。

### Observed

実際の仕事やコンテンツで確認されたこと。理由や意味はまだ確定していない。

### Unknown

まだ決まっていないこと。

Unknownは欠落ではなく、将来の発見や変化の余白。

AIは整合性のためにUnknownを勝手にKnownへ変えない。

## 矛盾の扱い

**矛盾を完全になくすことより、矛盾を勝手に埋めない。**

- Unknownを推測で埋めない
- Observationが食い違う場合、時点・Context・媒体・条件を確認する
- 解消できなければ `Conflict / 未解決` として残す
- 誤りと判明した場合も、訂正理由を残す
- 成長や変化だった可能性は、確認されるまで断定しない

## 不完全さ・ミス・訂正

**ミスを作らない。ミスを必要以上に消さない。**

低リスクの不完全さ、明示された不確かさ、独自の注意の向け方は必要以上に均さない。

一方で、安全、健康、法律、金融、セキュリティ、プライバシー、重大な事実誤認、不可逆な外部行動などはHuman Reviewを通す。

後から誤りが判明した場合は、誤情報を個性として残さず訂正する。ただし、元の判断、問題、修正、次の行動はObservationとして残せる。

## World Modelへの昇格条件

原則として次を確認する。

1. 出典となるObservationが特定できる
2. 一度きりではなく複数の行動に現れている
3. タスク指示や参照資料の単純反映ではない
4. 表面的なキャラクター付けではなく判断原理である
5. Knownや組織の境界と両立する
6. 未知の仕事にも役立つ
7. 人間が候補と根拠を確認できる

## Actor化の判断

Actorは、外部との接点が必要になったときだけ検討する。

Actor化の例：

- ラジオや動画へ継続出演する
- SNSやWebで固有の存在として発信する
- 一般ユーザーと会話する
- 物語上の人物として継続登場する

内部の調査、整理、監視、レビューだけならActor化しない。

Actor化した後も、媒体ごとに別人格を量産しない。同じWorld Modelから、その媒体の目的に合う表現を選ぶ。

## 人間メンバーの扱い

Real MemberはこのActor育成モデルの対象ではない。

ただし、共同作業を改善するため、本人の同意と実際の仕事に基づいて、

- 担当領域
- 本人が明示した好み
- 実際の判断
- 実際の成果物
- 本人が訂正した内容

などを運用Contextとして残すことはできる。

能力、感情、動機、障害、関係を推測で確定しない。本人の現在の意思と明示的な指示を優先する。

## 現在の保存単位

- `context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actorの組織上の正本
- `context/WORLD_MODEL_SEEDS.md` — Seedと候補の軽量一覧
- `context/ACTORS.md` — 外向けActorの軽量一覧
- `context/STORY_BIBLE.md` — 猫の世界観・関係・Character World Model
- `context/CAT_FOOTPRINTS.md` — 猫のObservation / Discovery候補
- `context/ACTOR_WORLD_MODEL.md` — Seedを育てActor化する共通方法

Seedが増え、一覧だけでは扱いにくくなった場合のみ、個別フォルダを検討する。

```text
context/seeds/<seed-id>/
├─ SEED.md
├─ OBSERVATIONS.md
└─ WORLD_MODEL.md
```

現時点では必要なSeedだけに使う。

## 新しいチャットでの読み方

組織やSeed / Actorを扱う仕事では、必要な範囲で次を読む。

1. `context/CURRENT.md`
2. `context/ORGANIZATION_MODEL.md`
3. `context/ACTOR_WORLD_MODEL.md`
4. `context/WORLD_MODEL_SEEDS.md`
5. Actorが必要なら `context/ACTORS.md`
6. 対象Seed / Actor / Contentの個別資料

すべてを毎回読む必要はない。

## 現時点で作らないもの

- 詳細を埋めた完成済み全社組織図
- 大量のAI社員キャラクター
- 性格診断の固定パラメータ
- Observationから自動で設定を確定する仕組み
- Unknownの自動補完
- Actor化の自動判定
- 全媒体の一括自動運用

必要性が実際の仕事から確認されてから追加する。

## 成功している状態

- 新しいSeedが少量のContextから仕事を始められる
- 実務が進むほどWorld Modelが育つ
- UnknownをUnknownのまま保持できる
- 人間とAIが行動から新しい判断原理を発見できる
- 外部表現が必要なSeedだけActor化される
- Actorが増えても全員が同じ声にならない
- コンテンツ品質と組織目的がキャラクター演出より優先される
