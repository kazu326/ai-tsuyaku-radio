import React from "react";
import {Audio, Video} from "@remotion/media";
import {AbsoluteFill, Composition, Sequence, staticFile} from "remotion";
import {BackgroundPlaylist} from "../Composition";
import {NativeBackgroundVideo} from "../episode2/NativeBackgroundVideo";
import timeline from "./timeline.json";

const Episode5AudioReview: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#111111"}}>
    <BackgroundPlaylist
      totalDurationInFrames={timeline.durationInFrames}
      videoComponent={NativeBackgroundVideo}
    />
    {timeline.segments.map((segment) => (
      <Sequence
        key={segment.id}
        from={segment.from}
        durationInFrames={segment.durationInFrames}
        name={`本編音声 ${segment.id} / 後続間隔 ${segment.gapAfterFrames}f`}
        layout="none"
      >
        <Audio
          src={staticFile(segment.audio)}
          trimBefore={Math.round(segment.audioStartSeconds * timeline.fps)}
          trimAfter={Math.round(segment.audioEndSeconds * timeline.fps)}
        />
      </Sequence>
    ))}
    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: 20,
        width: 200,
        height: 200,
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile("cat200.mp4")}
        muted
        objectFit="cover"
        style={{width: "100%", height: "100%"}}
      />
    </div>
  </AbsoluteFill>
);

export const Episode5AudioReviewComposition: React.FC = () => (
  <Composition
    id="AI-Radio-Episode5-AudioReview-v01"
    component={Episode5AudioReview}
    durationInFrames={timeline.durationInFrames}
    fps={timeline.fps}
    width={timeline.width}
    height={timeline.height}
  />
);
