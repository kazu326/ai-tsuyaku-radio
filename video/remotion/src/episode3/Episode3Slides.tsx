import React from "react";
import {interpolate, Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import cues from "./slide-cues.json";

const mint = "#82e4c3";
const amber = "#f4b860";
const blue = "#8cbbff";
const muted = "#aebbc9";
const panel = "rgba(13,24,36,0.92)";

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

const Core: React.FC = () => (
  <>
    <Label x={520} y={100} size={23} color={muted} anchor="middle">今回、一つだけ覚えて帰るなら</Label>
    <Label x={520} y={185} size={44} weight={700} anchor="middle">日本の半導体の強さは</Label>
    <Label x={520} y={260} size={53} color={amber} weight={700} anchor="middle">1000工程の途中</Label>
    <path d="M 270 315 H 770" stroke={mint} strokeWidth={3}/>
    <Label x={520} y={365} size={25} color={muted} anchor="middle">完成したチップの名前だけでは見えない</Label>
  </>
);

const History: React.FC<{time: number}> = ({time}) => {
  const shift = time >= 145.01;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>{shift ? "見る場所を、完成品から工場の中へ" : "1988年、日本は本当に半導体王国だった"}</Label>
      {!shift ? (
        <>
          <path d="M 95 240 H 945" stroke="#607386" strokeWidth={4}/>
          <circle cx={250} cy={240} r={14} fill={amber}/>
          <circle cx={790} cy={240} r={10} fill={blue}/>
          <Label x={250} y={178} size={36} color={amber} weight={700} anchor="middle">1988年</Label>
          <Label x={250} y={300} size={38} color="#ffffff" weight={700} anchor="middle">約半分</Label>
          <Label x={790} y={178} size={25} color={blue} anchor="middle">その後</Label>
          <Label x={790} y={300} size={25} color="#ffffff" anchor="middle">完成半導体で存在感が低下</Label>
          <Label x={40} y={406} size={20} color={muted}>「今も同じ意味で世界を支配している」という話ではありません。</Label>
        </>
      ) : (
        <>
          <rect x={85} y={130} width={280} height={170} fill="#233546" stroke={blue} strokeWidth={2}/>
          <Label x={225} y={205} size={25} anchor="middle">完成したチップ</Label>
          <Label x={225} y={247} size={20} color={muted} anchor="middle">目に見える企業名</Label>
          <path d="M 405 215 H 600 l -22 -16 M 600 215 l -22 16" fill="none" stroke={mint} strokeWidth={5}/>
          <rect x={640} y={108} width={315} height={214} fill="#203b3b" stroke={mint} strokeWidth={2}/>
          <Label x={798} y={178} size={27} color={mint} anchor="middle">工場の中</Label>
          <Label x={798} y={222} size={22} anchor="middle">装置・材料・検査</Label>
          <Label x={798} y={260} size={22} anchor="middle">1000を超える工程</Label>
          <Label x={520} y={390} size={25} color={amber} weight={700} anchor="middle">見る場所を変えると、景色が変わる</Label>
        </>
      )}
    </>
  );
};

const Process: React.FC<{time: number}> = ({time}) => {
  const thousand = time >= 201.45;
  const steps = ["膜を作る", "材料を塗る", "光で写す", "削る", "洗う", "測る・検査"];
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>{thousand ? "細かな仕事を、1000工程以上積み重ねる" : "半導体は、一台の機械からは出てこない"}</Label>
      {!thousand ? (
        <>
          {steps.map((step, index) => {
            const x = 52 + (index % 3) * 330;
            const y = 112 + Math.floor(index / 3) * 125;
            return (
              <g key={step}>
                <rect x={x} y={y} width={268} height={82} fill="#253b49" stroke={index % 2 ? blue : mint} strokeWidth={2}/>
                <Label x={x + 134} y={y + 51} size={24} anchor="middle">{step}</Label>
              </g>
            );
          })}
          <path d="M 905 318 C 985 318 985 102 905 102" fill="none" stroke={amber} strokeWidth={4}/>
          <path d="M 905 102 l 18 -12 M 905 102 l 18 12" stroke={amber} strokeWidth={4}/>
          <Label x={520} y={402} size={22} color={muted} anchor="middle">作る → 測る → 確認する → また次の工程へ</Label>
        </>
      ) : (
        <>
          <Label x={255} y={230} size={104} color={amber} weight={700} anchor="middle">1000+</Label>
          <Label x={255} y={286} size={25} anchor="middle">工程</Label>
          {Array.from({length: 70}, (_, index) => (
            <rect
              key={index}
              x={510 + (index % 14) * 31}
              y={115 + Math.floor(index / 14) * 45}
              width={18}
              height={18}
              fill={index % 9 === 0 ? amber : index % 3 === 0 ? blue : mint}
              opacity={0.82}
            />
          ))}
          <Label x={727} y={371} size={24} color={muted} anchor="middle">一社だけでは作れない</Label>
          <Label x={520} y={410} size={24} color="#ffffff" anchor="middle">一つのズレが、その後の工程にも影響する</Label>
        </>
      )}
    </>
  );
};

const Countries: React.FC<{time: number}> = ({time}) => {
  const team = time >= 278.31;
  const items = [
    ["アメリカ", "設計", "NVIDIA", blue],
    ["台湾", "製造", "TSMC", mint],
    ["韓国", "メモリ", "", "#d7a7ff"],
    ["日本", "装置・材料", "", amber],
  ] as const;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>{team ? "最先端半導体は、国境をまたぐチームで作る" : "国ごとに、得意な場所が違う"}</Label>
      {items.map(([country, role, example, color], index) => {
        const x = 38 + index * 252;
        return (
          <g key={country}>
            <rect x={x} y={115} width={220} height={190} fill="#223542" stroke={color} strokeWidth={3}/>
            <Label x={x + 110} y={164} size={25} color={color} weight={700} anchor="middle">{country}</Label>
            <Label x={x + 110} y={225} size={29} anchor="middle">{role}</Label>
            {example ? <Label x={x + 110} y={270} size={19} color={muted} anchor="middle">例：{example}</Label> : null}
          </g>
        );
      })}
      {team ? <path d="M 148 342 H 892" stroke={amber} strokeWidth={5}/> : null}
      {team ? [148, 400, 652, 892].map((x) => <circle key={x} cx={x} cy={342} r={9} fill={amber}/>) : null}
      <Label x={520} y={402} size={19} color={muted} anchor="middle">各国の産業を排他的に分類したものではない、大づかみな地図です。</Label>
    </>
  );
};

const Companies: React.FC = () => (
  <>
    <Label x={40} y={58} size={32} weight={700}>完成品の後ろを支える、日本企業の例</Label>
    <rect x={55} y={105} width={445} height={245} fill="#223542" stroke={blue} strokeWidth={3}/>
    <Label x={278} y={162} size={31} color={blue} weight={700} anchor="middle">東京エレクトロン</Label>
    <Label x={278} y={205} size={23} anchor="middle">半導体製造装置</Label>
    <Label x={278} y={252} size={20} color={muted} anchor="middle">塗る・膜を作る・削る・洗う</Label>
    <rect x={540} y={105} width={445} height={245} fill="#253b35" stroke={mint} strokeWidth={3}/>
    <Label x={763} y={162} size={34} color={mint} weight={700} anchor="middle">SUMCO</Label>
    <Label x={763} y={205} size={23} anchor="middle">シリコンウェハ</Label>
    <circle cx={763} cy={278} r={40} fill="#657682" stroke="#dbe6ed" strokeWidth={2}/>
    <Label x={520} y={407} size={20} color={muted} anchor="middle">Cerebras製品への個別供給関係を示す図ではありません。</Label>
  </>
);

const Hidden: React.FC = () => (
  <>
    <Label x={40} y={58} size={32} weight={700}>僕らが見るのは、最後に完成した半導体の名前</Label>
    <g opacity={0.45}>
      {["ウェハ", "材料", "製造装置", "検査"].map((item, index) => (
        <g key={item}>
          <rect x={75 + index * 210} y={125 + index * 22} width={185} height={130} fill="#254052" stroke={index % 2 ? mint : blue} strokeWidth={2}/>
          <Label x={168 + index * 210} y={198 + index * 22} size={21} anchor="middle">{item}</Label>
        </g>
      ))}
    </g>
    <rect x={370} y={218} width={300} height={145} fill="#d8b96d" stroke="#fff0b5" strokeWidth={4}/>
    <Label x={520} y={283} size={28} color="#19232b" weight={700} anchor="middle">完成したチップ</Label>
    <Label x={520} y={326} size={18} color="#35414b" anchor="middle">表に出る名前</Label>
    <Label x={520} y={414} size={26} color={amber} weight={700} anchor="middle">強さは、完成品の後ろに隠れている</Label>
  </>
);

const Physical: React.FC<{time: number}> = ({time}) => {
  const physical = time >= 470.37;
  return (
    <>
      <Label x={40} y={58} size={32} weight={700}>{physical ? "AIは、ものすごく物理的な産業でもある" : "Cerebrasから見える、世界の分業"}</Label>
      {!physical ? (
        <>
          {[
            ["アメリカ", "設計", blue],
            ["台湾", "製造", mint],
            ["さまざまな国", "装置・材料", amber],
          ].map(([place, role, color], index) => {
            const x = 62 + index * 327;
            return (
              <g key={String(place)}>
                <rect x={x} y={125} width={270} height={155} fill="#233746" stroke={String(color)} strokeWidth={3}/>
                <Label x={x + 135} y={185} size={26} color={String(color)} weight={700} anchor="middle">{place}</Label>
                <Label x={x + 135} y={239} size={26} anchor="middle">{role}</Label>
              </g>
            );
          })}
          <path d="M 332 202 H 389 M 659 202 H 716" stroke="#ffffff" strokeWidth={4}/>
          <Label x={520} y={350} size={23} anchor="middle">それぞれの強みがつながって、AIの土台になる</Label>
          <Label x={520} y={399} size={18} color={muted} anchor="middle">特定製品での日本企業の採用を断定する図ではありません。</Label>
        </>
      ) : (
        <>
          <rect x={75} y={118} width={890} height={72} fill="#1d3144" stroke={blue} strokeWidth={2}/>
          <Label x={520} y={165} size={27} anchor="middle">画面・クラウドの中に見えるAI</Label>
          <path d="M 520 205 V 252 l -14 -18 M 520 252 l 14 -18" stroke={mint} strokeWidth={4}/>
          {["工場", "巨大な装置", "材料", "物流"].map((item, index) => (
            <g key={item}>
              <rect x={67 + index * 242} y={282} width={205} height={82} fill="#253b35" stroke={mint} strokeWidth={2}/>
              <Label x={170 + index * 242} y={333} size={23} anchor="middle">{item}</Label>
            </g>
          ))}
          <Label x={520} y={414} size={23} color={amber} weight={700} anchor="middle">知能の一番下には、物理的な産業がある</Label>
        </>
      )}
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
      data-episode3-slide={kind}
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
        {kind === "core" ? <Core /> : null}
        {kind === "history" ? <History time={time} /> : null}
        {kind === "process" ? <Process time={time} /> : null}
        {kind === "countries" ? <Countries time={time} /> : null}
        {kind === "companies" ? <Companies /> : null}
        {kind === "hidden" ? <Hidden /> : null}
        {kind === "physical" ? <Physical time={time} /> : null}
      </g>
    </svg>
  );
};

export const Episode3Slides: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      {cues.filter((cue) => cue.enabled).map((cue) => {
        const from = Math.round(cue.startSeconds * fps);
        const durationInFrames = Math.round(cue.endSeconds * fps) - from;
        return (
          <Sequence
            key={cue.id}
            from={from}
            durationInFrames={durationInFrames}
            name={`図解 ${cue.id}`}
            layout="none"
          >
            <Slide kind={cue.kind} from={from} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </>
  );
};
