import type { PanelState } from "./AgentPanel";

export const AGENT_FPS = 30;
// ffprobe: teut-150s.mp3 = 147.487313 s. Add 1 s of breathing room.
export const AGENT_DURATION = Math.ceil((147.487313 + 1) * AGENT_FPS);
const f = (seconds: number) => Math.round(seconds * AGENT_FPS);
type Segment = {
  id: string;
  from: number;
  end: number;
  cue: boolean;
  states: PanelState[];
};
const roomSteps = ["空きを調べる", "条件を比べる", "候補をまとめる"];
const agentSteps = ["次の作業を選ぶ", "道具を使う", "結果を確認"];

// Absolute speech anchors from local ASR; converted to segment-local frames.
const segment = (
  id: string,
  start: number,
  end: number,
  cue: boolean,
  states: PanelState[],
): Segment => ({
  id,
  from: f(start),
  end: f(end),
  cue,
  states: states.map((state) => ({ ...state, at: f(state.at) - f(start) })),
});
export const agentSegments: Segment[] = [
  segment("V1 依頼の比較", 11.2, 39.4, true, [
    {
      at: 11.2,
      title: "会議室を探すなら",
      text: "探すコツを教えて",
      note: "答えを受け取り、自分で探す",
    },
    {
      at: 24.9,
      title: "会議室を探すなら",
      text: "条件に合う候補を\n3つ探して",
      note: "候補探しまで任せる",
    },
  ]),
  segment("V2 会議室探し", 39.9, 72.95, true, [
    { at: 39.9, title: "会議室探しの例", steps: roomSteps, active: 0 },
    { at: 47.16, title: "会議室探しの例", steps: roomSteps, active: 1 },
    {
      at: 51.58,
      title: "会議室探しの例",
      steps: roomSteps,
      active: 1,
      note: "4人用 → 条件に合わない",
    },
    {
      at: 55.26,
      title: "会議室探しの例",
      steps: roomSteps,
      active: 0,
      note: "条件に合わないので、探し直す",
    },
    {
      at: 59.46,
      title: "会議室探しの例",
      steps: roomSteps,
      active: 2,
      note: "条件に合う候補を3つ提示",
    },
    {
      at: 63.52,
      title: "候補が足りないときは",
      text: "条件を人に相談",
      note: "駅から少し離れてもいいですか？",
    },
  ]),
  segment("V3 仕組みの整理", 76.9, 106.95, true, [
    {
      at: 76.9,
      title: "目的に向けて、作業を進める",
      steps: agentSteps,
      active: 0,
    },
    {
      at: 80.56,
      title: "目的に向けて、作業を進める",
      steps: agentSteps,
      active: 1,
    },
    {
      at: 82.62,
      title: "目的に向けて、作業を進める",
      steps: agentSteps,
      active: 2,
    },
    {
      at: 86.14,
      title: "目的に向けて、作業を進める",
      steps: agentSteps,
      note: "必要なら繰り返す",
    },
    {
      at: 95.56,
      title: "目的に向けて、作業を進める",
      steps: agentSteps,
      note: "結果に応じて進め方を選ぶ",
    },
  ]),
  segment("V4 任せる範囲", 120.9, 131.1, true, [
    { at: 120.9, title: "今回の会議室探しなら", text: "候補探し：AIに任せる" },
    {
      at: 123.6,
      title: "今回の会議室探しなら",
      text: "予約前：人が確認",
      note: "どこまで任せるかを決めておく",
    },
  ]),
  segment("V5 結論", 131.3, 137.65, false, [
    {
      at: 131.3,
      title: "AIエージェント",
      text: "目的に向けて、道具を使い、\n結果を見ながら進める",
    },
  ]),
];
