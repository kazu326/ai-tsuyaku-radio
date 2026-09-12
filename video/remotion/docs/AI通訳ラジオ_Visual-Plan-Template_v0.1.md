# AI通訳ラジオ｜Visual Plan Template v0.1

## 目的

台本完成後に、AIが台本を意味構造へ分解し、
Remotionで使う映像設計へ橋渡しするための中間設計書。

この文書は「台本」と「Compositionコード」の間に置く。

---

## 基本フロー

```text
台本
↓
Macro Cluster 判定
↓
Visual Segment 判定
↓
各Segmentの理解目的を整理
↓
Visual Type / Asset / SE を選択
↓
Remotionへ
```

---

## Visual Plan

| # | 台本範囲 / 要約 | Macro Cluster | Visual Segment | 理解目的 | Visual Type | Asset / 内容 | SE | Entry / Update / Exit | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 導入：CPUとGPUの違いを知るとAIニュースが分かりやすい | CPUとGPUの違い | Background | 話題への導入 | Background | A Poolから選択 | なし | Background継続 | 導入はAから選ぶ |
| 2 | CPUは少人数の器用な人が順番に仕事をする | CPUとGPUの違い | CPU/GPU比較 | CPUの直感を作る | Comparison / Topic Visual | CPU1 | 1回 | Entry | CPU/GPUは同一Segment |
| 3 | GPUは大勢で同じ種類の計算を同時に進める | CPUとGPUの違い | CPU/GPU比較 | CPUとの差を理解する | Comparison / Topic Visual | GPU1 | なし | Update | パネル維持、中身だけ切替 |
| 4 | AIでは似た計算を大量に繰り返す | CPUとGPUの違い | CPU/GPU比較 | GPUがAIに向く理由を理解する | Comparison / Topic Visual | GPU1継続 | なし | Update / Hold | 必要なら補助図へ差替え |
| 5 | GPUだけあれば全部速くなるわけではない | AIの速さはシステム全体で決まる | System | 単一部品では決まらないと理解する | Diagram | CPU / GPU / データ / ネットワーク | 1回 | Entry | 新しい意味転換 |
| 6 | CPU、GPU、サーバー、ネットワークが組み合わさる | AIの速さはシステム全体で決まる | System または別Segment | 全体構造を理解する | Diagram / Topic Visual | Server1 またはSystem図 | 条件次第 | Update または再Entry | 間が長い場合はSegment分割 |
| 7 | 全体がスムーズにつながることが重要 | AIの速さはシステム全体で決まる | Closing | 結論を固定する | Text / Background | 短い結論表示 | なし | Exit → Background | 視覚補足を閉じる |

---

## 判定項目

### Macro Cluster

台本上の大きな意味のまとまり。

### Visual Segment

実際に連続表示する映像のまとまり。

同一Macro Clusterでも、次の場合は分けてよい。

- 間が長い
- 別の説明や例えを挟む
- Backgroundへ長く戻る
- 視聴者の注意が一度切れた方が自然

---

## 理解目的

「何を表示するか」より先に、

**この区間で視聴者に何を理解してほしいか**

を一文で書く。

例：

- CPUとGPUの違いを直感的に理解する
- 数値差の大きさを一目で理解する
- 複数部品が連携していることを理解する
- 実物の形をイメージする

---

## Visual Type 候補

Visual Typeは固定ルールではなく候補。

- Background
- Topic Visual
- Text Panel
- Comparison
- Bar Graph
- Diagram
- Flow
- Timeline
- Image
- Video
- Free Visual

AIは理解目的と素材を見て、最も自然な方法を選ぶ。

---

## SE

SEは原則としてVisual Segment開始時に1回。

同一Segment内のUpdateでは追加しない。

別Segmentとして再開する場合は、文脈と間隔を見て再度使用可。

---

## Motion

### Entry
Visual Segment開始時にContainerを開く。

### Update
同一Segment内ではContainerを維持し、中身だけ切り替える。

### Exit
Segment終了時に、
内容Fade Out → Containerを畳む → Backgroundへ戻る。

---

## 現時点の運用

1. 台本完成
2. AIがVisual Planをドラフト
3. 人間が意味クラスターとVisual Segmentだけ確認
4. 必要な素材を確認
5. Remotionへ反映

Visual Typeや細かいMotionは、必要以上に人間が指定せず、
共通文法と既存成功例をもとにAIが提案する。
