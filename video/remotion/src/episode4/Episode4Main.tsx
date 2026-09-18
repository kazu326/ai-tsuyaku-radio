import React from "react";
import {Audio, Video} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {AbsoluteFill, Composition, interpolate, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BackgroundPlaylist, SubtitleBox} from "../Composition";
import {NativeBackgroundVideo} from "../episode2/NativeBackgroundVideo";
import captionData from "./captions.json";
import {Episode4Slides} from "./Episode4Slides";
import seCues from "./se-cues.json";
import timeline from "./timeline.json";

const captions: Caption[] = captionData;
const reversedCaptions = [...captions].reverse();
const catStartFrame = 1817; // 60.57s: just after 「どうもこんにちは。」
const catDurationInFrames = 19919; // cat200.mp4 is 663.934s; intentionally not looped.

const CatWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 12], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: 20,
        width: 200,
        height: 200,
        borderRadius: "50%",
        overflow: "hidden",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        boxShadow: "0 0 0 3px rgba(244,163,64,0.72), 0 10px 30px rgba(0,0,0,0.32)",
      }}
    >
      <Video src={staticFile("cat200.mp4")} muted objectFit="cover" style={{width: "100%", height: "100%"}} />
    </div>
  );
};

const Episode4Main: React.FC = () => {
  const frame = useCurrentFrame();
  const activeCaption = reversedCaptions.find(
    (caption) =>
      frame >= Math.round((caption.startMs * timeline.fps) / 1000) &&
      frame < Math.round((caption.endMs * timeline.fps) / 1000),
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#111111"}}>
      <BackgroundPlaylist totalDurationInFrames={timeline.durationInFrames} videoComponent={NativeBackgroundVideo} />
      <Episode4Slides />
      {seCues.map((cue) => (
        <Sequence key={cue.id} from={cue.from} durationInFrames={cue.durationInFrames} name={`SE ${cue.purpose}`} layout="none">
          <Audio src={staticFile("se/panel-cue.mp3")} volume={() => cue.volume} />
        </Sequence>
      ))}
      {timeline.segments.map((segment) => (
        <Sequence
          key={segment.id}
          from={segment.from}
          durationInFrames={segment.durationInFrames}
          name={`本編音声 ${segment.id} / 後続間隔 ${segment.gapAfterFrames}f`}
          layout="none"
        >
          <Audio src={staticFile(segment.audio)} />
        </Sequence>
      ))}
      <Sequence from={catStartFrame} durationInFrames={catDurationInFrames} name="猫小窓（挨拶後・1回再生）" layout="none">
        <CatWindow />
      </Sequence>
      <SubtitleBox barColor="#F4A340">
        <span style={{whiteSpace: "pre-line"}}>{activeCaption?.text ?? ""}</span>
      </SubtitleBox>
    </AbsoluteFill>
  );
};

export const Episode4MainComposition: React.FC = () => (
  <Composition
    id="AI-Radio-Episode4-Main-v01"
    component={Episode4Main}
    durationInFrames={timeline.durationInFrames}
    fps={timeline.fps}
    width={timeline.width}
    height={timeline.height}
  />
);
