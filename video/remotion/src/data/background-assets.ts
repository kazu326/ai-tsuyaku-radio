export type BackgroundPool = "A" | "B" | "C" | "CAT" | "TOPIC";

export type BackgroundAsset = {
  id: string;
  file: string;
  pool: BackgroundPool;
  loopable: boolean;

  // 任意。ノーループ素材を自然な長さで使いたい時だけ追加。
  // 未指定なら Composition 側のデフォルト値を使う。
  maxSeconds?: number;
};

export const backgroundAssets: BackgroundAsset[] = [
  {id: "A1", file: "a1.mp4", pool: "A", loopable: false},
  {id: "A2", file: "a2.mp4", pool: "A", loopable: true},
  {id: "A3", file: "a3.mp4", pool: "A", loopable: true},
  {id: "A4", file: "a4.mp4", pool: "A", loopable: true},
  {id: "A5", file: "a5.mp4", pool: "A", loopable: true},
  {id: "A6", file: "a6.mp4", pool: "A", loopable: true},
  {id: "A7", file: "a7.mp4", pool: "A", loopable: true},
  {id: "A8", file: "a8.mp4", pool: "A", loopable: true},
  {id: "A9", file: "a9.mp4", pool: "A", loopable: true},
  {id: "A10", file: "a10.mp4", pool: "A", loopable: true},
  {id: "A11", file: "a11.mp4", pool: "A", loopable: true},

  {id: "B1", file: "b1.mp4", pool: "B", loopable: true},
  {id: "B2", file: "b2.mp4", pool: "B", loopable: false},
  {id: "B3", file: "b3.mp4", pool: "B", loopable: true},
  {id: "B4", file: "b4.mp4", pool: "B", loopable: true},
  {id: "B5", file: "b5.mp4", pool: "B", loopable: true},
  {id: "B6", file: "b6.mp4", pool: "B", loopable: true},
  {id: "B7", file: "b7.mp4", pool: "B", loopable: true},
  {id: "B8", file: "b8.mp4", pool: "B", loopable: false},
  {id: "B9", file: "b9.mp4", pool: "B", loopable: true},
  {id: "B10", file: "b10.mp4", pool: "B", loopable: true},

  {id: "C1", file: "c1.mp4", pool: "C", loopable: true},
  {id: "C2", file: "c2.mp4", pool: "C", loopable: false},
  {id: "C3", file: "c3.mp4", pool: "C", loopable: false},
  {id: "C4", file: "c4.mp4", pool: "C", loopable: false},
  {id: "C5", file: "c5.mp4", pool: "C", loopable: false},
  {id: "C6", file: "c6.mp4", pool: "C", loopable: true},
  {id: "C7", file: "c7.mp4", pool: "C", loopable: true},
  {id: "C8", file: "c8.mp4", pool: "C", loopable: true},

  {id: "CAT1", file: "cat1.mp4", pool: "CAT", loopable: false},
  {id: "CAT2", file: "cat2.mp4", pool: "CAT", loopable: false},
  {id: "CAT3", file: "cat3.mp4", pool: "CAT", loopable: false},

  {id: "CPU1", file: "cpu1.mp4", pool: "TOPIC", loopable: false},
  {id: "GPU1", file: "gpu1.mp4", pool: "TOPIC", loopable: false},
  {id: "GPU2", file: "gpu2.mp4", pool: "TOPIC", loopable: false},
  {id: "SERVER1", file: "server1.mp4", pool: "TOPIC", loopable: false},
];

export const regularBackgroundAssets = backgroundAssets.filter(
  (asset) => asset.pool === "A" || asset.pool === "B" || asset.pool === "C"
);
