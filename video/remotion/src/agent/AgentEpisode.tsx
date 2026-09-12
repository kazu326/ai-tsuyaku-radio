import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import {
  BackgroundPlaylist,
  CatCirclePlaceholder,
  PanelCueSE,
} from "../Composition";
import { AgentCaptions } from "./AgentCaptions";
import { AgentPanel } from "./AgentPanel";
import { AGENT_DURATION, AGENT_FPS, agentSegments } from "./timeline";

const AgentEpisode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#111111" }}>
    <BackgroundPlaylist totalDurationInFrames={AGENT_DURATION} />
    <Audio src={staticFile("teut-150s.mp3")} />
    {agentSegments.map((segment) => (
      <React.Fragment key={segment.id}>
        {segment.cue && (
          <Sequence
            from={segment.from - 6}
            durationInFrames={45}
            name={`${segment.id} Cue`}
          >
            <PanelCueSE />
          </Sequence>
        )}
        <Sequence
          from={segment.from}
          durationInFrames={segment.end - segment.from}
          name={segment.id}
        >
          <AgentPanel
            durationInFrames={segment.end - segment.from}
            states={segment.states}
          />
        </Sequence>
      </React.Fragment>
    ))}
    <CatCirclePlaceholder />
    <AgentCaptions />
  </AbsoluteFill>
);

export const AgentComposition: React.FC = () => (
  <Composition
    id="AI-Radio-Agent-v01"
    component={AgentEpisode}
    durationInFrames={AGENT_DURATION}
    fps={AGENT_FPS}
    width={1280}
    height={720}
  />
);
