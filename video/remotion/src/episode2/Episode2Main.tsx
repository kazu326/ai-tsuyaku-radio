import React from "react";
import { Audio, Video } from "@remotion/media";
import type { Caption } from "@remotion/captions";
import { AbsoluteFill, Composition, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BackgroundPlaylist, SubtitleBox } from "../Composition";
import captionData from "./captions.json";
import timeline from "./timeline.json";
import { NativeBackgroundVideo } from "./NativeBackgroundVideo";
import { Episode2Slides } from "./Episode2Slides";
import seCues from "./se-cues.json";

const captions: Caption[] = captionData;

const Episode2Main: React.FC = () => {
  const frame = useCurrentFrame();
  // V03: data already shifted once; next caption wins, stored end remains intact.
  const activeCaption = [...captions].reverse().find(
    (caption) => frame >= Math.round((caption.startMs * timeline.fps) / 1000)
      && frame < Math.round((caption.endMs * timeline.fps) / 1000),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#111111" }}>
      <BackgroundPlaylist totalDurationInFrames={timeline.durationInFrames} videoComponent={NativeBackgroundVideo} />
      <Episode2Slides />
      {seCues.map((cue) => (
        <Sequence key={cue.id} from={cue.from} durationInFrames={cue.durationInFrames} name={`SE ${cue.purpose}`} layout="none">
          <Audio src={staticFile("se/panel-cue.mp3")} volume={() => cue.volume} />
        </Sequence>
      ))}
      {timeline.segments.map((segment) => (
        <Sequence key={segment.id} from={segment.from} durationInFrames={segment.durationInFrames} name={`本編音声 ${segment.id}`} layout="none">
          <Audio src={staticFile(segment.audio)} />
        </Sequence>
      ))}
      <div style={{position:"absolute", left:20, bottom:20, width:200, height:200, borderRadius:"50%", overflow:"hidden"}}>
        <Video src={staticFile("cat200.mp4")} muted objectFit="cover" style={{width:"100%",height:"100%"}} />
      </div>
      <SubtitleBox barColor="#4CAF50">
        <span style={{whiteSpace:"pre-line"}}>{activeCaption?.text ?? ""}</span>
      </SubtitleBox>
    </AbsoluteFill>
  );
};

export const Episode2MainComposition: React.FC = () => (
  <Composition id="AI-Radio-Episode2-Main-v01" component={Episode2Main}
    durationInFrames={timeline.durationInFrames} fps={timeline.fps}
    width={timeline.width} height={timeline.height} />
);
