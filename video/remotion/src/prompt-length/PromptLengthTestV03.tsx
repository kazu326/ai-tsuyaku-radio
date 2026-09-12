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
import captionData from "./captions-v03.json";

const captions: Caption[] = captionData;
// Measured audio duration plus one second of breathing room; 30 fps.
const durationInFrames = Math.ceil((87.248938 + 1) * 30);

const PromptLengthTestV03: React.FC = () => {
  const frame = useCurrentFrame();
  // Prefer the next caption during overlap; stored end times stay unchanged.
  const activeCaption = [...captions].reverse().find(
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

export const PromptLengthCompositionV03: React.FC = () => (
  <Composition
    id="AI-Radio-PromptLength-v03"
    component={PromptLengthTestV03}
    durationInFrames={durationInFrames}
    fps={30}
    width={1280}
    height={720}
  />
);
