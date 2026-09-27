import React from "react";
import {interpolate, Sequence, useCurrentFrame} from "remotion";
import timeline from "./timeline.json";

const mint = "#82e4c3";
const amber = "#f4b860";
const blue = "#8cbbff";
const muted = "#aebbc9";
const white = "#f2f5fa";

const Text: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; color?: string; bold?: boolean}> =
  ({x, y, children, size = 25, color = white, bold = false}) => (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fill={color} fontWeight={bold ? 700 : 500}>{children}</text>
  );

const Box: React.FC<{x: number; y: number; w: number; h: number; color?: string; children: React.ReactNode}> =
  ({x, y, w, h, color = blue, children}) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#223746" stroke={color} strokeWidth={2.5} />
      {children}
    </g>
  );

const Arrow: React.FC<{x1: number; x2: number; y: number; color?: string}> = ({x1, x2, y, color = mint}) => (
  <path d={`M ${x1} ${y} H ${x2} l -18 -13 M ${x2} ${y} l -18 13`} fill="none" stroke={color} strokeWidth={4} />
);

const Content: React.FC<{section: number; progress: number}> = ({section, progress}) => {
  if (section === 1) return <>
    <Text x={520} y={70} size={31} bold>「約600万ドル」の驚き</Text>
    <Box x={70} y={130} w={360} h={200} color={amber}>
      <Text x={250} y={210} size={53} color={amber} bold>約560万ドル</Text>
      <Text x={250} y={270} size={23}>注目された数字</Text>
    </Box>
    <Arrow x1={460} x2={590} y={230} />
    <Box x={620} y={130} w={350} h={200} color={mint}>
      <Text x={795} y={210} size={31} color={mint} bold>何を測った数字？</Text>
      <Text x={795} y={265} size={23}>次に範囲を確かめる</Text>
    </Box>
  </>;
  if (section === 2) return <>
    <Text x={520} y={70} size={31} bold>約560万ドルの範囲</Text>
    <Box x={80} y={130} w={365} h={190} color={mint}>
      <Text x={262} y={205} size={32} color={mint} bold>DeepSeek-V3</Text>
      <Text x={262} y={258} size={23}>公式な学習のGPU時間</Text>
    </Box>
    <Text x={520} y={240} size={34} color={amber} bold>≠</Text>
    <Box x={595} y={130} w={365} h={190} color={muted}>
      <Text x={777} y={205} size={30} color={muted} bold>R1の開発総額</Text>
      <Text x={777} y={258} size={22}>会社全体の費用でもない</Text>
    </Box>
    <Text x={520} y={393} size={23} color={amber}>2048基のH800を使った学習の換算額</Text>
  </>;
  if (section === 3) return <>
    <Text x={520} y={70} size={31} bold>大きなAIを、必要な部分だけ動かす</Text>
    <Box x={55} y={145} w={220} h={160} color={blue}>
      <Text x={165} y={215} size={29} color={blue} bold>入力</Text>
      <Text x={165} y={263} size={20}>質問の内容</Text>
    </Box>
    <g opacity={progress > 0.18 ? 1 : 0.2}><Arrow x1={300} x2={390} y={225} /></g>
    <Box x={410} y={120} w={220} h={210} color={mint}>
      <Text x={520} y={195} size={29} color={mint} bold>担当部分</Text>
      <Text x={520} y={246} size={20}>必要な部分を選ぶ</Text>
    </Box>
    <g opacity={progress > 0.34 ? 1 : 0.2}><Arrow x1={655} x2={745} y={225} /></g>
    <Box x={765} y={145} w={220} h={160} color={amber}>
      <Text x={875} y={215} size={29} color={amber} bold>出力</Text>
      <Text x={875} y={263} size={20}>計算を止めない</Text>
    </Box>
    <Text x={520} y={398} size={23} color={muted}>GPU同士のデータ待ちも減らす</Text>
  </>;
  if (section === 4) return <>
    <Text x={520} y={70} size={31} bold>土台のV3から、考える力を伸ばすR1へ</Text>
    <Box x={75} y={130} w={305} h={190} color={blue}>
      <Text x={227} y={205} size={33} color={blue} bold>V3</Text>
      <Text x={227} y={263} size={22}>土台のモデル</Text>
    </Box>
    <g opacity={progress > 0.2 ? 1 : 0.2}><Arrow x1={410} x2={610} y={225} color={mint} /></g>
    <Box x={640} y={130} w={305} h={190} color={amber}>
      <Text x={792} y={205} size={33} color={amber} bold>R1</Text>
      <Text x={792} y={263} size={21}>答えを確かめながら学ぶ</Text>
    </Box>
    <Text x={520} y={393} size={22} color={muted}>R1の学習に使ったGPU時間の総額は未公表</Text>
  </>;
  if (section === 5) return <>
    <Text x={520} y={70} size={31} bold>輸出管理は、工夫の原因だったのか</Text>
    <Box x={85} y={135} w={340} h={170} color={blue}>
      <Text x={255} y={212} size={30} color={blue} bold>GPUへの制約</Text>
      <Text x={255} y={265} size={21}>確認できる環境</Text>
    </Box>
    <Text x={520} y={235} size={45} color={amber} bold>？</Text>
    <Box x={615} y={135} w={340} h={170} color={mint}>
      <Text x={785} y={212} size={30} color={mint} bold>設計上の工夫</Text>
      <Text x={785} y={265} size={21}>DeepSeekの報告</Text>
    </Box>
    <Text x={520} y={386} size={23} color={amber}>公開資料だけで因果関係は断定できない</Text>
  </>;
  if (section === 6) return <>
    <Text x={520} y={70} size={31} bold>GPUの量と、その使い方</Text>
    <Box x={55} y={135} w={275} h={170} color={blue}>
      <Text x={192} y={210} size={30} color={blue} bold>計算資源</Text>
      <Text x={192} y={264} size={22}>強いGPU・台数</Text>
    </Box>
    <g opacity={progress > 0.18 ? 1 : 0.2}><Arrow x1={350} x2={415} y={220} /></g>
    <Box x={435} y={135} w={245} h={170} color={mint}>
      <Text x={557} y={210} size={30} color={mint} bold>設計</Text>
      <Text x={557} y={264} size={21}>無駄なく使う</Text>
    </Box>
    <g opacity={progress > 0.34 ? 1 : 0.2}><Arrow x1={700} x2={765} y={220} /></g>
    <Box x={785} y={135} w={200} h={170} color={amber}>
      <Text x={885} y={210} size={30} color={amber} bold>能力</Text>
      <Text x={885} y={264} size={21}>AIの性能</Text>
    </Box>
    <Text x={520} y={390} size={22} color={muted}>強いGPUも、働かせる設計も重要</Text>
  </>;
  return <>
    <Text x={520} y={105} size={25} color={muted}>今日、一つだけ覚えて帰るなら</Text>
    <Text x={520} y={185} size={34} color={amber} bold>限られた計算を</Text>
    <Text x={520} y={252} size={40} color={mint} bold>どれだけ無駄なく能力へ変えるか</Text>
    <Text x={520} y={335} size={24}>それもAI競争の一つ</Text>
  </>;
};

const Slide: React.FC<{section: number; duration: number}> = ({section, duration}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"}),
    interpolate(frame, [duration - 12, duration - 1], [1, 0], {extrapolateLeft: "clamp"}),
  );
  return <svg data-episode5-slide={section} viewBox="0 0 1040 440" style={{
    position: "absolute", left: 120, top: 50, width: 1040, height: 440,
    background: "rgba(13,24,36,0.93)", borderLeft: `2px solid ${mint}`,
    fontFamily: 'Arial, "Yu Gothic", sans-serif', opacity,
  }}>
    <Content section={section} progress={frame / duration} />
  </svg>;
};

const chapterTitles = [
  "", "約560万ドルは、何の値段なのか", "大きなAIを、全部いっぺんに動かさない",
  "R1は、考え方の学ばせ方も変えた", "輸出規制がDeepSeekを作ったのか",
  "GPUの価値が下がったわけではない", "まとめ",
];

const ChapterTitle: React.FC<{title: string; duration: number}> = ({title, duration}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 7], [0, 1], {extrapolateRight: "clamp"}),
    interpolate(frame, [duration - 10, duration], [1, 0], {extrapolateLeft: "clamp"}),
  );
  return <div style={{
    position: "absolute", left: 120, top: 50, width: 1040, height: 440,
    background: "#081524", borderLeft: `6px solid ${amber}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: white, fontFamily: 'Arial, "Yu Gothic", sans-serif', fontSize: 45,
    fontWeight: 700, textAlign: "center", padding: 28, boxSizing: "border-box", opacity,
  }}>{title}</div>;
};

export const Episode5Slides: React.FC = () => <>
  {timeline.segments.map((segment, index) => {
    const section = index + 1;
    const titleDuration = section === 7 ? 32 : 110;
    return <React.Fragment key={segment.id}>
      <Sequence from={segment.from} durationInFrames={segment.durationInFrames} name={`図解 ${section}`} layout="none">
        <Slide section={section} duration={segment.durationInFrames} />
      </Sequence>
      {section > 1 && <Sequence from={segment.from} durationInFrames={titleDuration} name={`章タイトル ${section}`} layout="none">
        <ChapterTitle title={chapterTitles[index]} duration={titleDuration} />
      </Sequence>}
    </React.Fragment>;
  })}
</>;
