import React from "react";
import { Loop, OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import type { BackgroundAsset } from "../data/background-assets";
import metadata from "./background-video-metadata.json";

// Episode 2 only. Outer playlist sequences and fades stay in BackgroundPlaylist.
export const NativeBackgroundVideo: React.FC<{asset: BackgroundAsset}> = ({asset}) => {
  const {fps} = useVideoConfig();
  const video = <OffthreadVideo src={staticFile(`video/${asset.file}`)} muted
    style={{width:"100%",height:"100%",objectFit:"cover"}} />;
  if (!asset.loopable) return video;
  const info = metadata[asset.file as keyof typeof metadata];
  if (!info) throw new Error(`Missing video duration: ${asset.file}`);
  return <Loop durationInFrames={Math.round(Number(info.duration)*fps)}>{video}</Loop>;
};
