import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { BackgroundPlaylist, SubtitleBox } from "../Composition";
import layout from "./caption-layout.json";

// SILENT LAYOUT DRAFT ONLY. These timings are not narration alignment.
// Replace with actual speech timestamps after the manually generated audio arrives.
const previewFrames = 90 * 30;
const totalWeight = layout.reduce(
  (sum, item) => sum + item.text.replace(/\s/g, "").length,
  0,
);
let cursor = 0;
const preview = layout.map((item) => {
  const from = Math.round((cursor / totalWeight) * (previewFrames - 30));
  cursor += item.text.replace(/\s/g, "").length;
  const end = Math.round((cursor / totalWeight) * (previewFrames - 30));
  return { ...item, from, end };
});

const PromptLengthLayoutDraft: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#111111" }}>
    <BackgroundPlaylist totalDurationInFrames={previewFrames} />
    {preview.map((item, index) => (
      <Sequence
        key={index}
        from={item.from}
        durationInFrames={item.end - item.from}
        name={`仮時刻・字幕 ${index + 1}`}
      >
        <SubtitleBox barColor="#4CAF50">
          <span style={{ whiteSpace: "pre-line" }}>{item.text}</span>
        </SubtitleBox>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const PromptLengthDraftComposition: React.FC = () => (
  <Composition
    id="AI-Radio-PromptLength-LayoutDraft"
    component={PromptLengthLayoutDraft}
    durationInFrames={previewFrames}
    fps={30}
    width={1280}
    height={720}
  />
);
