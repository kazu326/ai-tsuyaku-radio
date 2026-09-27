import "./index.css";
import { MyComposition } from "./Composition";
import { AgentComposition } from "./agent/AgentEpisode";
import { PromptLengthComposition } from "./prompt-length/PromptLengthTest";

import { PromptLengthCompositionV02 } from "./prompt-length/PromptLengthTestV02";

import { PromptLengthCompositionV03 } from "./prompt-length/PromptLengthTestV03";
import { Episode2MainComposition } from "./episode2/Episode2Main";
import { Episode3MainComposition } from "./episode3/Episode3Main";
import { Episode4AudioReviewComposition } from "./episode4/Episode4AudioReview";
import { Episode4MainComposition } from "./episode4/Episode4Main";
import { Episode5AudioReviewComposition } from "./episode5/Episode5AudioReview";
import { Episode5MainComposition } from "./episode5/Episode5Main";
import { Episode6MainComposition } from "./episode6/Episode6Main";
import { Episode6MainV02Composition } from "./episode6/Episode6MainV02";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <AgentComposition />
      <PromptLengthComposition />
      <PromptLengthCompositionV02 />
      <PromptLengthCompositionV03 />
      <Episode2MainComposition />
      <Episode3MainComposition />
      <Episode4AudioReviewComposition />
      <Episode4MainComposition />
      <Episode5AudioReviewComposition />
      <Episode5MainComposition />
      <Episode6MainComposition />
      <Episode6MainV02Composition />
    </>
  );
};
