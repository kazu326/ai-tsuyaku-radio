import React from "react";
import {Audio, Video} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BackgroundPlaylist} from "../Composition";
import {NativeBackgroundVideo} from "../episode2/NativeBackgroundVideo";
import captionData from "./captions-v02.json";
import {Episode6VisualsV02} from "./Episode6VisualsV02";
import timeline from "./timeline-v02.json";
import visuals from "./visuals-v02.json";

const captions: Caption[] = captionData;
const reversedCaptions = [...captions].reverse();

const Episode6MainV02: React.FC = () => {
  const frame = useCurrentFrame();
  const activeCaption = reversedCaptions.find((caption) =>
    frame >= Math.round((caption.startMs * timeline.fps) / 1000) &&
    frame < Math.round((caption.endMs * timeline.fps) / 1000));

  return <AbsoluteFill style={{backgroundColor: "#111111"}}>
    <BackgroundPlaylist totalDurationInFrames={timeline.durationInFrames} videoComponent={NativeBackgroundVideo} />
    <Episode6VisualsV02 />
    {timeline.segments.map((segment) => <Sequence key={segment.id} from={segment.from}
      durationInFrames={segment.durationInFrames} name={`本編音声 ${segment.id}`} layout="none">
      <Audio src={staticFile(segment.audio)} trimBefore={segment.trimBeforeFrames}
        trimAfter={segment.trimAfterFrames} />
    </Sequence>)}
    {visuals.seCues.map((cue) => <Sequence key={cue.id} from={cue.from}
      durationInFrames={cue.durationInFrames} name={`SE ${cue.id}`} layout="none">
      <Audio src={staticFile("se/panel-cue.mp3")} volume={() => cue.volume} />
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

export const Episode6MainV02Composition: React.FC = () => <Composition
  id="AI-Radio-Episode6-Main-v02"
  component={Episode6MainV02}
  durationInFrames={timeline.durationInFrames}
  fps={timeline.fps}
  width={timeline.width}
  height={timeline.height}
/>;
