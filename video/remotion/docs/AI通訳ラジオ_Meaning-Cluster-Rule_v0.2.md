# AI通訳ラジオ｜Meaning Cluster Rule v0.2

## 目的

映像演出を「セリフごと」ではなく、視聴者がひとまとまりとして理解する**意味構造**に合わせて設計する。

v0.2では、意味上のまとまりと、実際に連続表示する映像上のまとまりを分ける。

---

## 1. 二層構造

### Macro Cluster

大きな意味のまとまり。

例：
- AIの速さは何で決まるか
- CPUとGPUはどう違うか
- GPUだけでは速さが決まらない理由

### Visual Segment

実際に連続して表示する映像上のまとまり。

同じMacro Cluster内でも、

- 間が長い
- 別の説明や例えを挟む
- 通常Backgroundへ戻る時間が長い
- 視聴者の注意が一度リセットされたと考えた方が自然

と判断される場合は、Visual Segmentを分ける。

---

## 2. 基本原則

### 意味が近いだけでは、同じVisual Segmentにしない

判断には次の両方を見る。

1. 意味的につながっているか
2. 認知上も連続しているか

両方が成立する場合は、同一Visual Segmentとして扱う。

---

## 3. 同一Visual Segment内

同じVisual Segment内では、

```text
SE
↓
パネル展開
↓
内容A
↓
中身だけ内容Bへ切り替え
↓
Segment終了
↓
パネルを閉じる
```

を基本とする。

SEは原則としてSegment開始時に1回。

---

## 4. Visual Segmentを分ける場合

同じMacro Cluster内でも、間が長い場合は一度閉じる。

```text
Macro Cluster
├─ Visual Segment 1
│  SE
│  ↓
│  System
│  ↓
│  パネルを閉じる
│
├─ 通常Background / 別説明
│
└─ Visual Segment 2
   SE
   ↓
   Server
   ↓
   パネルを閉じる
```

---

## 5. 確認済み成功例

### CPU / GPU

CPUとGPUは意味的にも認知上も連続していたため、1つのVisual Segmentとして扱った。

- SE：1回
- パネル開閉：1回
- CPU → GPU：中身だけ切り替え
- 結果：別々に開閉するより見やすく、ひとまとまりの説明として自然だった

---

## 6. System / Server の扱い

SystemとServerは意味的に近くても、必ず同じVisual Segmentにするわけではない。

- 時間的に近い
- 間に別の説明がない
- 注意が同じ説明へ向いたまま

なら同じSegment。

逆に、

- 間が長い
- 別の例えや説明を挟む
- Backgroundへ戻る時間が長い

なら別Segmentに分ける。

---

## 7. 現時点では固定しないこと

- 「何秒以上なら分ける」という固定秒数
- Macro Clusterの長さ
- Visual Segmentの長さ
- SEの厳密な秒数
- Visual Type
- パネル形状

判断は台本の意味構造と、実際に視聴したときの自然さを優先する。
