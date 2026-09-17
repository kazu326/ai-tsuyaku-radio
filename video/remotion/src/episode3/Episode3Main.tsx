import React from "react";
import {Audio, Video} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BackgroundPlaylist, SubtitleBox} from "../Composition";
import {NativeBackgroundVideo} from "../episode2/NativeBackgroundVideo";
import captionData from "./captions.json";
import {Episode3Slides} from "./Episode3Slides";
import seCues from "./se-cues.json";
import timeline from "./timeline.json";

const captions: Caption[] = captionData;

const Episode3Main: React.FC = () => {
  const frame = useCurrentFrame();
  // V03 baseline: data is shifted once; next caption wins and stored end stays intact.
  const activeCaption = [...captions].reverse().find(
    (caption) =>
      frame >= Math.round((caption.startMs * timeline.fps) / 1000) &&
      frame < Math.round((caption.endMs * timeline.fps) / 1000),
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#111111"}}>
      <BackgroundPlaylist
        totalDurationInFrames={timeline.durationInFrames}
        videoComponent={NativeBackgroundVideo}
      />
      <Episode3Slides />
      {seCues.map((cue) => (
        <Sequence
          key={cue.id}
          from={cue.from}
          durationInFrames={cue.durationInFrames}
          name={`SE ${cue.purpose}`}
          layout="none"
        >
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
      <div style={{position: "absolute", left: 20, bottom: 20, width: 200, height: 200, borderRadius: "50%", overflow: "hidden"}}>
        <Video src={staticFile("cat200.mp4")} muted objectFit="cover" style={{width: "100%", height: "100%"}} />
      </div>
      <SubtitleBox barColor="#F4A340">
        <span style={{whiteSpace: "pre-line"}}>{activeCaption?.text ?? ""}</span>
      </SubtitleBox>
    </AbsoluteFill>
  );
};

export const Episode3MainComposition: React.FC = () => (
  <Composition
    id="AI-Radio-Episode3-Main-v01"
    component={Episode3Main}
    durationInFrames={timeline.durationInFrames}
    fps={timeline.fps}
    width={timeline.width}
    height={timeline.height}
  />
);
