import React from "react";
import { Sequence } from "remotion";
import type { Caption } from "@remotion/captions";
import { SubtitleBox } from "../Composition";
import captionData from "./captions.json";

const captions: Caption[] = captionData;
export const AgentCaptions: React.FC = () => (
  <>
    {captions.map((caption, index) => {
      const from = Math.round((caption.startMs * 30) / 1000);
      const end = Math.round((caption.endMs * 30) / 1000);
      return (
        <Sequence
          key={index}
          from={from}
          durationInFrames={end - from}
          name={`字幕 ${index + 1}`}
        >
          <SubtitleBox barColor="#4CAF50">{caption.text}</SubtitleBox>
        </Sequence>
      );
    })}
  </>
);
