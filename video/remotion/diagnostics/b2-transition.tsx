import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Composition, OffthreadVideo, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame } from "remotion";

// Standalone entry: production Root, BackgroundPlaylist and assets are untouched.
// At diagnostic frame 295 b2 is at 9.8333s; a7 starts at frame 291.
const Layer: React.FC<{file:string; fadeIn?:boolean; fadeOut?:boolean; native?:boolean}> = ({file,fadeIn=false,fadeOut=false,native=false}) => {
  const frame=useCurrentFrame();
  const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
  const opacity=Math.min(fadeIn?interpolate(frame,[0,9],[0,1],clamp):1,fadeOut?interpolate(frame,[291,300],[1,0],clamp):1);
  return <AbsoluteFill style={{opacity}}>{native
    ? <OffthreadVideo src={staticFile(`video/${file}`)} muted style={{width:"100%",height:"100%",objectFit:"cover"}} />
    : <Video src={staticFile(`video/${file}`)} muted loop={file==="a7.mp4"} style={{width:"100%",height:"100%",objectFit:"cover"}} />}</AbsoluteFill>;
};
const Test: React.FC<{mode:"single"|"cut"|"fade";native?:boolean}> = ({mode,native=false}) => <AbsoluteFill style={{backgroundColor:"#111111"}}>
  <Sequence durationInFrames={mode==="single"?360:mode==="cut"?291:300}>
    <Layer file="b2.mp4" native={native} fadeOut={mode==="fade"}/>
  </Sequence>
  {mode!=="single"&&<Sequence from={291}><Layer file="a7.mp4" native={native} fadeIn={mode==="fade"}/></Sequence>}
</AbsoluteFill>;
const Root: React.FC = () => <>
  <Composition id="B2-Single" component={Test} defaultProps={{mode:"single" as const}} durationInFrames={360} width={1280} height={720} fps={30}/>
  <Composition id="B2-HardCut" component={Test} defaultProps={{mode:"cut" as const}} durationInFrames={360} width={1280} height={720} fps={30}/>
  <Composition id="B2-Crossfade" component={Test} defaultProps={{mode:"fade" as const}} durationInFrames={360} width={1280} height={720} fps={30}/>
  <Composition id="B2-NativeHardCut" component={Test} defaultProps={{mode:"cut" as const,native:true}} durationInFrames={360} width={1280} height={720} fps={30}/>
  <Composition id="B2-NativeCrossfade" component={Test} defaultProps={{mode:"fade" as const,native:true}} durationInFrames={360} width={1280} height={720} fps={30}/>
</>;
registerRoot(Root);
