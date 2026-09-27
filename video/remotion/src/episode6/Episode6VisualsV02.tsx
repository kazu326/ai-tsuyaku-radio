import React from "react";
import {OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import visuals from "./visuals-v02.json";

type Panel = (typeof visuals.panels)[number];

const PanelContent: React.FC<{panel: Panel}> = ({panel}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [panel.durationInFrames - 10, panel.durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const count = panel.cards.length;
  const cardWidth = count === 1 ? 760 : count === 2 ? 600 : count === 3 ? 430 : 330;
  const gap = count === 1 ? 0 : count === 2 ? 110 : count === 3 ? 75 : 70;
  const totalWidth = count * cardWidth + (count - 1) * gap;
  const startX = (1700 - totalWidth) / 2;

  return <svg
    data-episode6-panel={panel.id}
    viewBox="0 0 1700 740"
    style={{
      position: "absolute", left: 110, top: 50, width: 1700, height: 740,
      background: "rgba(7, 27, 44, 0.96)",
      border: "2px solid rgba(161, 208, 231, 0.7)", borderRadius: 8,
      boxSizing: "border-box", opacity: Math.min(fadeIn, fadeOut),
      fontFamily: 'Arial, "Yu Gothic", sans-serif',
    }}
  >
    <text x="850" y="143" textAnchor="middle" fill="#f2f5fa" fontSize="52" fontWeight="700">
      {panel.title}
    </text>
    <line x1="190" y1="173" x2="1510" y2="173" stroke="#426681" strokeWidth="2" />
    {panel.cards.map((card, index) => {
      const x = startX + index * (cardWidth + gap);
      const opacity = interpolate(frame, [8 + index * 7, 18 + index * 7], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
      return <g key={`${panel.id}-${index}`} opacity={opacity}>
        <rect x={x} y="260" width={cardWidth} height="180" rx="18"
          fill="#16324f" stroke={index === count - 1 ? "#f4a340" : "#82c8df"} strokeWidth="3" />
        <text x={x + cardWidth / 2} y="362" textAnchor="middle" dominantBaseline="middle"
          fill="#f2f5fa" fontSize={card.length > 11 ? 30 : 37} fontWeight="700">{card}</text>
        {panel.relation === "flow" && index < count - 1 && <g opacity={interpolate(frame, [17 + index * 7, 27 + index * 7], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        })}>
          <path d={`M ${x + cardWidth + 14} 350 H ${x + cardWidth + gap - 22} m -18 -13 l 18 13 -18 13`}
            fill="none" stroke="#f4a340" strokeWidth="5" />
        </g>}
        {panel.relation === "contrast" && index === 0 && <text
          x={x + cardWidth + gap / 2} y="362" textAnchor="middle" dominantBaseline="middle"
          fill="#f4a340" fontSize="56" fontWeight="700">≠</text>}
      </g>;
    })}
    {panel.footer && <text x="850" y="604" textAnchor="middle" fill="#f4b860" fontSize="33" fontWeight="600">
      {panel.footer}
    </text>}
  </svg>;
};

const ChapterTitle: React.FC<{title: string; durationInFrames: number}> = ({title, durationInFrames}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateRight: "clamp"}),
    interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {extrapolateLeft: "clamp"}),
  );
  return <div style={{
    position: "absolute", left: 110, top: 50, width: 1700, height: 740,
    backgroundColor: "#081524", borderLeft: "9px solid #f4a340",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#f2f5fa", fontSize: 64, fontWeight: 700,
    fontFamily: 'Arial, "Yu Gothic", sans-serif', textAlign: "center",
    padding: 42, boxSizing: "border-box", opacity,
  }}>{title}</div>;
};

export const Episode6VisualsV02: React.FC = () => <>
  {visuals.canvas.map((clip) => <Sequence key={`canvas-${clip.id}`} from={clip.from}
    durationInFrames={clip.durationInFrames} name={`Canvas ${clip.id}`} layout="none">
    <OffthreadVideo src={staticFile(clip.file)} muted style={{
      position: "absolute", left: clip.x, top: clip.y,
      width: clip.width, height: clip.height, objectFit: "contain",
      borderRadius: 7, boxShadow: "0 0 0 2px rgba(214,232,246,0.88)",
    }} />
  </Sequence>)}
  {visuals.panels.map((panel) => <Sequence key={panel.id} from={panel.from}
    durationInFrames={panel.durationInFrames} name={`図解 ${panel.id}`} layout="none">
    <PanelContent panel={panel} />
  </Sequence>)}
  {visuals.chapterTitles.map((chapter) => <Sequence key={`chapter-${chapter.id}`} from={chapter.from}
    durationInFrames={chapter.durationInFrames} name={`章タイトル ${chapter.id}`} layout="none">
    <ChapterTitle title={chapter.title} durationInFrames={chapter.durationInFrames} />
  </Sequence>)}
</>;
