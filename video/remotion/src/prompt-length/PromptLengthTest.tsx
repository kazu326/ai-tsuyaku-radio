import React from "react";
import { Audio } from "@remotion/media";
import type { Caption } from "@remotion/captions";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BackgroundPlaylist, SubtitleBox } from "../Composition";
import captionData from "./captions.json";

const captions: Caption[] = captionData;
// Measured audio duration plus one second of breathing room; 30 fps.
const durationInFrames = Math.ceil((87.248938 + 1) * 30);

const PromptLengthTest: React.FC = () => {
  const frame = useCurrentFrame();
  const activeCaption = captions.find(
    (caption) =>
      frame >= Math.round((caption.startMs * 30) / 1000) &&
      frame < Math.round((caption.endMs * 30) / 1000),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#111111" }}>
      <BackgroundPlaylist totalDurationInFrames={durationInFrames} />
      <Audio src={staticFile("test-90s.mp3")} />
      {/* Keep the mask and bar mounted during speech gaps; only text changes. */}
      <SubtitleBox barColor="#4CAF50">
        <span style={{ whiteSpace: "pre-line" }}>
          {activeCaption?.text ?? ""}
        </span>
      </SubtitleBox>
    </AbsoluteFill>
  );
};

export const PromptLengthComposition: React.FC = () => (
  <Composition
    id="AI-Radio-PromptLength-v01"
    component={PromptLengthTest}
    durationInFrames={durationInFrames}
    fps={30}
    width={1280}
    height={720}
  />
);
