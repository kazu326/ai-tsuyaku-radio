# AIラジオ Remotion MVP v0.1｜End-to-End Visual Plan

## テーマ
AIの速さはGPUだけでは決まらない

## テスト目的
既存の共通文法だけで、
台本 → Meaning Structure → Visual Plan → Remotion → MP4
まで通せるか確認する。

新機能は追加しない。

---

## Macro Cluster 1
### CPUとGPUの違い

#### Visual Segment 1：導入
- 理解目的：今回の問いを作る
- Visual Type：Background
- Asset：A Pool
- SE：なし
- Motion：Background継続

#### Visual Segment 2：CPU → GPU比較
- 理解目的：CPUとGPUの役割差を直感的に理解する
- Visual Type：Comparison / Topic Visual
- Asset：CPU1 → GPU1
- SE：Segment開始時に1回
- Entry：パネル展開
- Update：CPUからGPUへ中身だけ切り替え
- Exit：Cluster終了時にパネルを閉じる
- Notes：CPU/GPUは1つのVisual Segmentとして扱う

---

## Macro Cluster 2
### GPUだけ速くても全体は速くならない

#### Visual Segment 3：14倍の例
- 理解目的：単一部品の速度と全体速度は同じではないと理解する
- Visual Type：Bar Graph
- 内容：
  - 計算性能：14×
  - 全体体感：待ち時間があると14×にはならない
- SE：新しい意味転換として1回
- Entry：Bar Graph表示
- Update：バー成長
- Exit：短く閉じる
- Notes：数値の正確な実測比較ではなく、台本中の説明用概念図として扱う

#### Visual Segment 4：資料が届かなければ止まる
- 理解目的：データ移動がボトルネックになる直感を作る
- Visual Type：Diagram
- 内容：計算 → データ → 接続 → 次の処理
- SE：前Segmentとの間隔が短ければなし
- Entry / Update：意味の連続性に応じて同一Segment化してもよい

---

## Macro Cluster 3
### AIの速さはシステム全体で決まる

#### Visual Segment 5：System
- 理解目的：CPU / GPU / Memory / Server / Network が一つのシステムとして動くことを理解する
- Visual Type：Diagram + Topic Visual
- Asset：Server1
- SE：Segment開始時に1回
- Entry：System Diagram
- Update：Server Visualへ切り替え
- Exit：結論前に閉じる

#### Visual Segment 6：結論
- 理解目的：「一人の天才ではなくチーム全体の連携」という一文を残す
- Visual Type：Text Panel または Background + Short Text
- SE：なし
- Motion：短い表示 → Backgroundへ戻る

---

## 使用する既存要素
- Background Playlist v0.3
- background-assets.ts
- Subtitle Baseline
- PanelCueSE
- CPU/GPU Meaning Cluster
- Bar Graph
- System Diagram
- Topic Visual
- Exit Motion

## MVP PASS条件
1. 最終MP4までレンダーできる
2. 音声・字幕・SE・Visualのズレが大きくない
3. Background切替が自然
4. CPU/GPUが1クラスターとして自然
5. Bar Graphが説明を邪魔しない
6. System Diagram → Serverの流れが自然
7. 全体を普通に視聴して「作り込みのテスト感」より「一本の動画」に見える

## MVPではやらない
- 素材自動分類
- Analytics連携
- 自動素材検索
- 画像生成自動化
- Visual Typeの完全自動選択
- Asset Registry自動更新
