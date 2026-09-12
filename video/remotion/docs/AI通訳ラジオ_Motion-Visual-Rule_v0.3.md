# AI通訳ラジオ｜Motion / Visual Rule v0.3

## 目的

AI通訳ラジオの映像を、音声理解を邪魔せず、意味構造に沿って視覚補助するための現時点の確定ルール。

---

## 1. Background

### Background Playlist Baseline v0.3

- A / B / C は素材選択Pool
- A / B / C は厳密な前半・中盤・後半固定ではない
- 導入は必ずAから選ぶ
- Aの中では前半向き素材を優先する
- その後はA / B / Cを自由に行き来できる
- 同一素材の連続使用は避ける
- 同一Poolが過度に連続しないようにする
- 切替は短いCrossfadeを使用する
- Backgroundは意味を説明する主役ではなく、音声を邪魔しない環境として扱う

### Loop管理

素材ごとに `loopable` を持つ。

- `YES`：必要に応じてループ可
- `NO`：ループさせない

---

## 2. Subtitle

- 1280×720基準
- 左寄せ固定
- 白文字
- 通常28px
- 左側に細い縦バー
- 黒背景マスク 60%
- left: 240
- bottom: 30
- width: 920
- height: 150
- 固定文字数より自然な意味区切りと実表示幅を優先
- 強調32px / Boldは標準では使わない

---

## 3. SE

### Cognitive Punctuation / 理解再同期Cue

SEは視聴維持のための刺激ではなく、意味の切り替わりを自然に知らせるCue。

- 明るい短い「ピコン / キラン」系
- volume: 0.08 を基準
- Visualやセリフに少し先行
- ただしVisualとの距離を空けすぎない
- 原則としてVisual Segment開始時に1回
- 同一Segment内では繰り返さない

---

## 4. Panel Motion

### Entry

**「気づくけど、待たされない」**

- パネルは中央から横方向へ展開
- パネルと文字・画像は別レイヤー
- 文字や画像をパネルと一緒にScaleしない
- パネル展開後、文字・画像が自然にFade In

### Exit

```text
文字・画像 Fade Out
↓
パネルが中央へ畳まれる
↓
Backgroundへ戻る
```

突然消さない。

---

## 5. Meaning Structure

映像設計では二層を使う。

### Macro Cluster
大きな意味のまとまり。

### Visual Segment
実際に連続表示する映像のまとまり。

同じMacro Clusterでも、認知上の連続性が切れるならVisual Segmentを分ける。

---

## 6. Visual Segment内の基本動作

```text
Segment開始
↓
必要ならSE
↓
Visual Containerを開く
↓
同一Segment内は中身だけ更新
↓
Segment終了
↓
Visual Containerを閉じる
```

### 確認済み例：CPU / GPU

- SE：1回
- パネル開閉：1回
- CPU → GPU：中身だけ切り替え
- 見やすさ・意味の連続性ともに改善

---

## 7. Segmentを分ける判断

次のような場合は、意味が近くてもVisual Segmentを分けてよい。

- 間が長い
- 別の説明や例えを挟む
- 通常Backgroundへ長く戻る
- 視聴者の注意が一度リセットされた方が自然

固定秒数では判定しない。

---

## 8. Visual Type

現時点では黒い横長パネルを共通Containerとして使用。

将来的には意味クラスターの理解目的に応じてVisual Typeを選ぶ。

- 比較 → 左右比較 / 棒グラフ / 1 vs 1000
- 流れ → フロー図
- 構造 → 図解
- 実物 → 画像 / 動画
- 数値差 → 棒グラフ
- 時系列 → タイムライン
- 概念整理 → Text Panel

Visual Typeはまだ固定ルール化しない。

---

## 9. 優先順位

1. 視聴者が意味を理解しやすいか
2. 音声理解を邪魔しないか
3. 意味構造と演出単位が一致しているか
4. 認知上の連続性が自然か
5. 素材の自然さ
6. 見た目の演出性
