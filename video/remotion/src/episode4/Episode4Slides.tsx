import React from "react";
import {interpolate, Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import cues from "./slide-cues.json";

const enabledCues = cues.filter((cue) => cue.enabled);

const mint = "#82e4c3";
const amber = "#f4b860";
const blue = "#8cbbff";
const violet = "#d7a7ff";
const muted = "#aebbc9";
const panel = "rgba(13,24,36,0.93)";

const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}> = ({x, y, children, size = 23, color = "#f2f5fa", weight = 500, anchor = "start"}) => (
  <text x={x} y={y} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}>
    {children}
  </text>
);

const Box: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  children: React.ReactNode;
}> = ({x, y, width, height, color, children}) => (
  <g>
    <rect x={x} y={y} width={width} height={height} fill="#223746" stroke={color} strokeWidth={2.5} />
    {children}
  </g>
);

const Intro: React.FC = () => (
  <>
    <Label x={40} y={58} size={32} weight={700}>ただの場所が、何かを生み出す場所になる</Label>
    <Box x={65} y={110} width={335} height={230} color={mint}>
      <path d="M 95 270 Q 230 205 370 270" fill="none" stroke={mint} strokeWidth={4}/>
      {[0, 1, 2, 3].map((row) => (
        <path key={row} d={`M 110 ${245 + row * 18} Q 230 ${190 + row * 18} 355 ${245 + row * 18}`} fill="none" stroke="#577d70" strokeWidth={2}/>
      ))}
      <Label x={232} y={165} size={31} color={mint} weight={700} anchor="middle">畑</Label>
      <Label x={232} y={310} size={20} color={muted} anchor="middle">時間をかけて、作物を生む</Label>
    </Box>
    <path d="M 435 224 H 592 l -22 -16 M 592 224 l -22 16" fill="none" stroke={amber} strokeWidth={5}/>
    <Box x={630} y={110} width={345} height={230} color={amber}>
      <rect x={678} y={202} width={205} height={92} fill="#2e4656" stroke={amber} strokeWidth={2}/>
      <path d="M 678 202 l 50 -42 48 42 50 -42 57 42" fill="none" stroke={amber} strokeWidth={3}/>
      <rect x={900} y={142} width={30} height={152} fill="#344e5e" stroke={amber} strokeWidth={2}/>
      <Label x={802} y={150} size={31} color={amber} weight={700} anchor="middle">半導体工場</Label>
      <Label x={802} y={322} size={20} color={muted} anchor="middle">時間をかけて、計算の土台を生む</Label>
    </Box>
    <Label x={520} y={402} size={27} color="#ffffff" weight={700} anchor="middle">なぜ、世界中がこの場所を取り合うのか</Label>
  </>
);

const World: React.FC = () => {
  const items = [
    ["設計", "アメリカ", blue],
    ["製造", "台湾", mint],
    ["メモリ", "韓国", violet],
    ["装置・材料", "日本ほか", amber],
  ] as const;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>半導体は、国境をまたぐ巨大なチームで作る</Label>
      {items.map(([role, place, color], index) => {
        const x = 38 + index * 252;
        return (
          <Box key={role} x={x} y={110} width={220} height={175} color={color}>
            <Label x={x + 110} y={170} size={31} color={color} weight={700} anchor="middle">{role}</Label>
            <Label x={x + 110} y={226} size={23} anchor="middle">{place}</Label>
          </Box>
        );
      })}
      <path d="M 148 320 H 892" stroke={mint} strokeWidth={4}/>
      {[148, 400, 652, 892].map((x) => <circle key={x} cx={x} cy={320} r={8} fill={mint}/>) }
      <Label x={300} y={385} size={25} color={blue} weight={700} anchor="middle">供給の安定</Label>
      <Label x={520} y={385} size={22} color={muted} anchor="middle">＋</Label>
      <Label x={740} y={385} size={25} color={amber} weight={700} anchor="middle">経済安全保障</Label>
      <Label x={520} y={423} size={16} color={muted} anchor="middle">役割は説明用の大づかみな整理で、排他的な分類ではありません。</Label>
    </>
  );
};

const Core: React.FC = () => (
  <>
    <Label x={520} y={96} size={23} color={muted} anchor="middle">今回、一つだけ覚えて帰るなら</Label>
    <Label x={520} y={174} size={41} weight={700} anchor="middle">国が取り合っているのは</Label>
    <Label x={520} y={244} size={49} color={amber} weight={700} anchor="middle">工場の建物ではない</Label>
    <path d="M 250 292 H 790" stroke={mint} strokeWidth={3}/>
    <Label x={520} y={354} size={34} color={mint} weight={700} anchor="middle">AIを作り続けられる能力</Label>
    <Label x={520} y={405} size={22} color={muted} anchor="middle">必要な計算を、止めずに確保できること</Label>
  </>
);

const Compute: React.FC<{time: number}> = ({time}) => {
  const kitchen = time >= 209.7;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>{kitchen ? "レシピをコピーできても、厨房はコピーできない" : "AIのアイデアと、AIを動かせることは別"}</Label>
      {!kitchen ? (
        <>
          <Box x={60} y={125} width={270} height={170} color={blue}>
            <Label x={195} y={192} size={30} color={blue} weight={700} anchor="middle">モデル・データ</Label>
            <Label x={195} y={245} size={21} color={muted} anchor="middle">アイデア</Label>
          </Box>
          <path d="M 355 210 H 445 l -18 -13 M 445 210 l -18 13" stroke="#ffffff" strokeWidth={4}/>
          <Box x={470} y={125} width={240} height={170} color={amber}>
            <Label x={590} y={192} size={30} color={amber} weight={700} anchor="middle">半導体</Label>
            <Label x={590} y={245} size={21} color={muted} anchor="middle">計算する力</Label>
          </Box>
          <path d="M 735 210 H 825 l -18 -13 M 825 210 l -18 13" stroke="#ffffff" strokeWidth={4}/>
          <Box x={850} y={125} width={130} height={170} color={mint}>
            <Label x={915} y={192} size={27} color={mint} weight={700} anchor="middle">AI</Label>
            <Label x={915} y={245} size={18} color={muted} anchor="middle">提供</Label>
          </Box>
          <Label x={520} y={386} size={27} color="#ffffff" weight={700} anchor="middle">使う人が増えるほど、計算場所も必要になる</Label>
        </>
      ) : (
        <>
          <Box x={80} y={125} width={340} height={210} color={blue}>
            <Label x={250} y={205} size={44} color={blue} weight={700} anchor="middle">レシピ</Label>
            <Label x={250} y={270} size={24} anchor="middle">モデル・アイデア</Label>
          </Box>
          <path d="M 455 228 H 585 l -20 -15 M 585 228 l -20 15" stroke={amber} strokeWidth={5}/>
          <Box x={620} y={125} width={340} height={210} color={amber}>
            <Label x={790} y={205} size={44} color={amber} weight={700} anchor="middle">厨房</Label>
            <Label x={790} y={270} size={24} anchor="middle">半導体・データセンター</Label>
          </Box>
          <Label x={520} y={399} size={25} color={mint} weight={700} anchor="middle">計算基盤は、物理的に作って置く必要がある</Label>
        </>
      )}
    </>
  );
};

const Fab: React.FC = () => {
  const needs = ["装置", "材料", "電力", "水", "人"];
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>半導体工場は、必要だと思った翌日には作れない</Label>
      <Label x={235} y={230} size={98} color={amber} weight={700} anchor="middle">1000+</Label>
      <Label x={235} y={286} size={25} anchor="middle">工程</Label>
      {needs.map((need, index) => {
        const x = 470 + (index % 3) * 175;
        const y = 112 + Math.floor(index / 3) * 112;
        return (
          <Box key={need} x={x} y={y} width={145} height={76} color={index % 2 ? blue : mint}>
            <Label x={x + 72.5} y={y + 48} size={23} anchor="middle">{need}</Label>
          </Box>
        );
      })}
      <path d="M 75 342 H 965" stroke="#607386" strokeWidth={4}/>
      <circle cx={140} cy={342} r={9} fill={blue}/>
      <circle cx={520} cy={342} r={9} fill={amber}/>
      <circle cx={900} cy={342} r={9} fill={mint}/>
      <Label x={140} y={386} size={19} anchor="middle">建設</Label>
      <Label x={520} y={386} size={19} anchor="middle">工程調整</Label>
      <Label x={900} y={386} size={19} anchor="middle">安定生産</Label>
      <Label x={520} y={422} size={18} color={muted} anchor="middle">大きな投資と、失敗した時のリスクがある</Label>
    </>
  );
};

const Shortage: React.FC<{time: number}> = ({time}) => {
  const ai = time >= 364.88;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>{ai ? "半導体不足の記憶に、AIが加わった" : "小さな部品が、大きな工場を止めた"}</Label>
      {!ai ? (
        <>
          <Box x={65} y={125} width={240} height={180} color={amber}>
            <rect x={145} y={165} width={80} height={80} fill="#d8b96d" stroke="#fff0b5" strokeWidth={3}/>
            <Label x={185} y={280} size={20} color={amber} anchor="middle">半導体不足</Label>
          </Box>
          <path d="M 335 213 H 445 l -20 -15 M 445 213 l -20 15" stroke="#ffffff" strokeWidth={4}/>
          <Box x={475} y={105} width={230} height={105} color={blue}>
            <Label x={590} y={170} size={25} anchor="middle">自動車</Label>
          </Box>
          <Box x={475} y={235} width={230} height={105} color={mint}>
            <Label x={590} y={300} size={25} anchor="middle">家電</Label>
          </Box>
          <path d="M 735 213 H 835 l -20 -15 M 835 213 l -20 15" stroke="#ffffff" strokeWidth={4}/>
          <Label x={915} y={205} size={46} color="#ff8f7f" weight={700} anchor="middle">停止</Label>
          <Label x={520} y={401} size={24} color={muted} anchor="middle">届かなくなってから工場を作っても、間に合わない</Label>
        </>
      ) : (
        <>
          {[["企業", blue], ["医療", mint], ["行政", violet]].map(([label, color], index) => (
            <Box key={String(label)} x={65 + index * 315} y={120} width={260} height={100} color={String(color)}>
              <Label x={195 + index * 315} y={182} size={29} anchor="middle">{label}</Label>
            </Box>
          ))}
          <path d="M 195 252 H 825" stroke={amber} strokeWidth={4}/>
          {[195, 510, 825].map((x) => <circle key={x} cx={x} cy={252} r={8} fill={amber}/>) }
          <Box x={315} y={290} width={410} height={82} color={amber}>
            <Label x={520} y={342} size={30} color={amber} weight={700} anchor="middle">AI向け半導体</Label>
          </Box>
          <Label x={520} y={416} size={23} color={muted} anchor="middle">産業と社会を支えるなら、確保は国の問題になる</Label>
        </>
      )}
    </>
  );
};

const Locations: React.FC = () => {
  const nodes = [
    [180, 240, "台湾", mint],
    [420, 135, "アリゾナ", blue],
    [650, 280, "熊本", amber],
    [875, 155, "ドイツ", violet],
  ] as const;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>同じ企業を、複数の場所へ呼んでいる</Label>
      <path d="M 180 240 C 330 110 325 120 420 135 M 180 240 C 360 330 500 320 650 280 M 180 240 C 460 75 680 100 875 155" fill="none" stroke="#5b7184" strokeWidth={4}/>
      {nodes.map(([x, y, label, color]) => (
        <g key={label}>
          <circle cx={x} cy={y} r={38} fill="#223746" stroke={color} strokeWidth={4}/>
          <Label x={x} y={y + 8} size={21} color={color} weight={700} anchor="middle">{label}</Label>
        </g>
      ))}
      <Box x={315} y={335} width={410} height={62} color={amber}>
        <Label x={520} y={375} size={25} color={amber} weight={700} anchor="middle">場所と製造ルートの選択肢</Label>
      </Box>
      <Label x={520} y={426} size={16} color={muted} anchor="middle">拠点の例。各拠点だけで供給網が完結することを意味しません。</Label>
    </>
  );
};

const Resilience: React.FC = () => (
  <>
    <Label x={40} y={58} size={32} weight={700}>国内に一つ工場があっても、自給自足ではない</Label>
    {[["製造装置", blue], ["材料", mint], ["設計技術", violet]].map(([label, color], index) => (
      <Box key={String(label)} x={55 + index * 310} y={105} width={270} height={85} color={String(color)}>
        <Label x={190 + index * 310} y={160} size={25} anchor="middle">{label}</Label>
      </Box>
    ))}
    <path d="M 190 215 C 190 290 410 290 520 325 M 500 215 C 500 265 510 280 520 325 M 810 215 C 810 290 630 290 520 325" fill="none" stroke={amber} strokeWidth={4}/>
    <circle cx={520} cy={325} r={49} fill="#2c4352" stroke={amber} strokeWidth={4}/>
    <Label x={520} y={334} size={25} color={amber} weight={700} anchor="middle">工場</Label>
    <Label x={520} y={404} size={25} color="#ffffff" weight={700} anchor="middle">一本の道を、二本・三本へ</Label>
    <Label x={520} y={431} size={16} color={muted} anchor="middle">競争と協力が、同時に起きている</Label>
  </>
);

const Capability: React.FC<{time: number}> = ({time}) => {
  const physical = time >= 595.63;
  const summary = time >= 629.13;
  if (summary) return <Core />;
  if (physical) {
    return (
      <>
        <Label x={40} y={58} size={32} weight={700}>AIの競争は、世界地図の上でも起きている</Label>
        <rect x={80} y={105} width={880} height={78} fill="#1d3144" stroke={blue} strokeWidth={2}/>
        <Label x={520} y={156} size={28} anchor="middle">画面の中では、国境がないように見えるAI</Label>
        <path d="M 520 198 V 248 l -15 -20 M 520 248 l 15 -20" stroke={mint} strokeWidth={4}/>
        {[["土地", blue], ["電力", amber], ["水", mint], ["人", violet]].map(([label, color], index) => (
          <Box key={String(label)} x={65 + index * 242} y={278} width={205} height={82} color={String(color)}>
            <Label x={167 + index * 242} y={330} size={26} anchor="middle">{label}</Label>
          </Box>
        ))}
        <Label x={520} y={414} size={23} color={amber} weight={700} anchor="middle">一番下には、物理的な場所がある</Label>
      </>
    );
  }
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>本当に取り合っているもの</Label>
      <Box x={65} y={115} width={330} height={220} color={muted}>
        <Label x={230} y={190} size={30} color={muted} weight={700} anchor="middle">工場の建物</Label>
        <Label x={230} y={252} size={21} anchor="middle">目に見えるニュース</Label>
      </Box>
      <path d="M 430 225 H 570 l -22 -16 M 570 225 l -22 16" stroke={amber} strokeWidth={5}/>
      <Box x={605} y={95} width={370} height={260} color={amber}>
        <Label x={790} y={165} size={29} color={amber} weight={700} anchor="middle">作り続ける能力</Label>
        <Label x={790} y={220} size={22} anchor="middle">半導体を確保する</Label>
        <Label x={790} y={260} size={22} anchor="middle">開発を止めない</Label>
        <Label x={790} y={300} size={22} anchor="middle">別の道を選べる</Label>
      </Box>
      <Label x={520} y={414} size={25} color={mint} weight={700} anchor="middle">工場は、その能力を支える選択肢</Label>
    </>
  );
};

const Slide: React.FC<{kind: string; from: number; durationInFrames: number}> = ({kind, from, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = (frame + from) / fps;
  const panelOpen = Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
    interpolate(frame, [durationInFrames - 9, durationInFrames - 1], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
  );
  const contentOpacity = Math.min(
    interpolate(frame, [6, 13], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
    interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
  );
  return (
    <svg
      data-episode4-slide={kind}
      viewBox="0 0 1040 440"
      style={{
        position: "absolute",
        left: 120,
        top: 50,
        width: 1040,
        height: 440,
        fontFamily: 'Arial, "Yu Gothic", sans-serif',
        background: panel,
        borderLeft: `2px solid ${mint}`,
        clipPath: `inset(0 ${(1 - panelOpen) * 50}%)`,
      }}
    >
      <g opacity={contentOpacity}>
        {kind === "intro" ? <Intro /> : null}
        {kind === "world" ? <World /> : null}
        {kind === "core" ? <Core /> : null}
        {kind === "compute" ? <Compute time={time} /> : null}
        {kind === "fab" ? <Fab /> : null}
        {kind === "shortage" ? <Shortage time={time} /> : null}
        {kind === "locations" ? <Locations /> : null}
        {kind === "resilience" ? <Resilience /> : null}
        {kind === "capability" ? <Capability time={time} /> : null}
      </g>
    </svg>
  );
};

export const Episode4Slides: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      {enabledCues.map((cue) => {
        const from = Math.round(cue.startSeconds * fps);
        const durationInFrames = Math.round(cue.endSeconds * fps) - from;
        return (
          <Sequence key={cue.id} from={from} durationInFrames={durationInFrames} name={`図解 ${cue.id}`} layout="none">
            <Slide kind={cue.kind} from={from} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </>
  );
};
