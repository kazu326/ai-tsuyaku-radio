import React from "react";
import {Audio, Video} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {AbsoluteFill, Composition, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BackgroundPlaylist} from "../Composition";
import {NativeBackgroundVideo} from "../episode2/NativeBackgroundVideo";
import captionData from "./captions.json";
import timeline from "./timeline.json";

const captions: Caption[] = captionData;
const reversedCaptions = [...captions].reverse();
const canvasClips = [
  {id: "A", from: 212.8, duration: 55.2, file: "episode6/canvas/ep006_A_weights_from_212.80s.webm"},
  {id: "B", from: 293.6, duration: 30.6, file: "episode6/canvas/ep006_B_foundation_from_293.60s.webm"},
] as const;

const CanvasClips: React.FC = () => <>
  {canvasClips.map((clip) => <Sequence
    key={clip.id}
    from={Math.round(clip.from * timeline.fps)}
    durationInFrames={Math.round(clip.duration * timeline.fps)}
    name={`Canvas ${clip.id} ${clip.from.toFixed(2)}s–${(clip.from + clip.duration).toFixed(2)}s`}
    layout="none"
  >
    <OffthreadVideo
      src={staticFile(clip.file)}
      muted
      style={{
        position: "absolute", left: 110, top: 50,
        width: 1700, height: 740, objectFit: "contain",
      }}
    />
  </Sequence>)}
</>;

const chapterTitles = [
  "高価なAIの横に、ダウンロードボタンがある",
  "無料で配りながら、有料でも売れる",
  "公開されているのは、AIのどこまで？",
  "公開した先にできる「土台」",
  "Season 1の終わりに",
];

const Episode6Main: React.FC = () => {
  const frame = useCurrentFrame();
  const activeCaption = reversedCaptions.find((caption) =>
    frame >= Math.round((caption.startMs * timeline.fps) / 1000) &&
    frame < Math.round((caption.endMs * timeline.fps) / 1000));

  return <AbsoluteFill style={{backgroundColor: "#111111"}}>
    <BackgroundPlaylist totalDurationInFrames={timeline.durationInFrames} videoComponent={NativeBackgroundVideo} />
    <CanvasClips />
    {timeline.segments.map((segment) => <Sequence
      key={segment.id}
      from={segment.from}
      durationInFrames={segment.durationInFrames}
      name={`本編音声 ${segment.id}`}
      layout="none"
    >
      <Audio src={staticFile(segment.audio)} />
    </Sequence>)}
    {timeline.segments.map((segment, index) => <Sequence
      key={`chapter-${segment.id}`}
      from={segment.from}
      durationInFrames={Math.min(90, segment.durationInFrames)}
      name={`章タイトル ${index + 1}`}
      layout="none"
    >
      <div style={{
        position: "absolute", left: 110, top: 50, width: 1700, height: 740,
        backgroundColor: "#081524", borderLeft: "9px solid #F4A340",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#f2f5fa", fontSize: 64, fontWeight: 700,
        fontFamily: 'Arial, "Yu Gothic", sans-serif', textAlign: "center",
        padding: 42, boxSizing: "border-box",
      }}>{chapterTitles[index]}</div>
    </Sequence>)}
    <div style={{
      position: "absolute", left: 30, bottom: 30, width: 300, height: 300,
      borderRadius: "50%", overflow: "hidden",
      boxShadow: "0 0 0 4px rgba(244,163,64,0.72), 0 15px 45px rgba(0,0,0,0.32)",
    }}>
      <Video src={staticFile("cat200.mp4")} muted objectFit="cover" style={{width: "100%", height: "100%"}} />
    </div>
    <div style={{
      position: "absolute", left: 360, bottom: 45, width: 1380, height: 225,
      backgroundColor: "rgba(0,0,0,0.60)", display: "flex", alignItems: "center",
      boxSizing: "border-box", paddingLeft: 42, paddingRight: 42,
    }}>
      <div style={{
        width: "100%", borderLeft: "6px solid #F4A340", paddingLeft: 27,
        color: "white", fontSize: 42, fontWeight: 500, lineHeight: 1.5,
        textAlign: "left", whiteSpace: "pre-line",
      }}>{activeCaption?.text ?? ""}</div>
    </div>
  </AbsoluteFill>;
};

export const Episode6MainComposition: React.FC = () => <Composition
  id="AI-Radio-Episode6-Main-v01"
  component={Episode6Main}
  durationInFrames={timeline.durationInFrames}
  fps={timeline.fps}
  width={timeline.width}
  height={timeline.height}
/>;
