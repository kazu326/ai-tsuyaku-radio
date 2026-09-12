import React from "react";
import {Img, staticFile, Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import cues from "./slide-cues.json";

const mint = "#82e4c3";
const blue = "#8cbbff";
const muted = "#aebbc9";
const Label: React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string}> = ({x,y,children,size=23,color="#f2f5fa"}) => <text x={x} y={y} fontSize={size} fill={color}>{children}</text>;
// One gentle emphasis, always visible; original appearance returns after 0.8 seconds.
const emphasisOpacity = (seconds:number) => 1-0.18*Math.sin(Math.PI*Math.max(0,Math.min(1,seconds/0.8)))**2;
const Dot: React.FC<{x:number;y:number;color?:string;emphasisSeconds?:number}> = ({x,y,color=mint,emphasisSeconds}) => <g fill={color} opacity={emphasisSeconds===undefined?1:emphasisOpacity(emphasisSeconds)}><circle cx={x} cy={y} r={9}/><rect x={x-12} y={y+13} width={24} height={22}/></g>;
const Arrow: React.FC<{d:string;color?:string;emphasisSeconds?:number}> = ({d,color=mint,emphasisSeconds}) => {
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 return <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="butt" strokeLinejoin="miter" opacity={emphasisOpacity(Math.min(frame/fps,emphasisSeconds??frame/fps))}/>;
};

const Jobs: React.FC<{time:number}> = ({time}) => <>
  <Label x={40} y={56} size={32}>仕事の配り方が違う</Label>
  <path d="M 40 94 V 340" stroke={blue} strokeWidth={3}/>
  <path d="M 510 94 V 340" stroke={mint} strokeWidth={3} opacity={time>=118.706?1:0.35}/>
  <Label x={68} y={126} color={blue}>CPU ／ 器用な委員長</Label>
  <Dot x={130} y={205} color={blue} emphasisSeconds={time-105.467}/>
  {["計算する","調べる","判断する"].map((t,i)=><g key={t}><path d={`M 235 ${176+i*57} H 250`} stroke={blue} strokeWidth={2}/><Label x={268} y={184+i*57}>{t}</Label></g>)}
  {time>=118.706&&<><Label x={538} y={126} color={mint}>GPU ／ みんなで同じ計算</Label>{Array.from({length:12},(_,i)=><Dot key={i} x={574+(i%6)*73} y={183+Math.floor(i/6)*81} emphasisSeconds={time-118.706}/>)}<Label x={557} y={329} size={21}>同じ種類の問題を一斉に配る</Label></>}
  <Label x={40} y={404} size={22} color={muted}>{time>=130.886?"AIは、こうした大量の計算を繰り返す":"学校での仕事に置き換えたイメージ"}</Label>
</>;

const Classrooms: React.FC<{time:number}> = ({time}) => {
  const open=time>=251.08;
  const transfer=time>=189.692;
  return <>
    <Label x={40} y={56} size={32}>{open?"近い場所で、データをやり取りする":"人数を増やすと、教室も分かれる"}</Label>
    <rect x={60} y={95} width={920} height={220} fill="#20343e" stroke="#648b99" strokeWidth={2}/>
    {!open&&[365,674].map(x=><path key={x} d={`M ${x} 95 V 315`} stroke="#9dafbc" strokeWidth={9}/>)}
    {Array.from({length:12},(_,i)=><Dot key={i} x={115+(i%6)*159} y={135+Math.floor(i/6)*92}/>)}
    {!transfer&&<Label x={94} y={368} color={blue}>100人 → 1000人 → 1万人</Label>}
    {transfer&&<>
      <Arrow d={open?"M 286 190 H 409 l -15 -12 M 409 190 l -15 12":"M 286 285 V 354 H 433 V 285 l -12 15 M 433 285 l 12 15"} emphasisSeconds={time-(open?251.08:189.692)}/>
      <Label x={open?452:467} y={open?202:360} color={mint}>{open?"すぐ隣へ":"廊下を通って、隣の教室へ"}</Label>
    </>}
    <Label x={40} y={410} size={21} color={muted}>{transfer?"プリント ＝ データ　／　計算の速さだけでなく、運ぶ速さも大切":"教室と生徒は、計算場所と並列計算の比喩"}</Label>
  </>;
};

const Wafer: React.FC<{time:number}> = ({time}) => {
 const size=time>=304.58;
 return <>
   <Label x={40} y={56} size={32}>{size?"小さく切る発想から、大きくまとめる発想へ":"ウェハを作り、小さなチップに切り分ける"}</Label>
   {!size?<>
     <circle cx={244} cy={228} r={137} fill="#334a55" stroke={mint} strokeWidth={3}/>
     {Array.from({length:25},(_,i)=>{const x=(i%5)-2,y=Math.floor(i/5)-2;return x*x+y*y<=5?<rect key={i} x={244+x*43-17} y={228+y*43-17} width={34} height={34} fill="#d5b97a"/>:null;})}
     <Arrow d="M 425 226 H 581 l -18 -14 M 581 226 l -18 14" emphasisSeconds={time-286.767}/>
     {[0,1,2].map(i=><rect key={i} x={650+i*89} y={190} width={62} height={62} fill="#d5b97a"/>)}
     <Label x={180} y={397}>丸いウェハ</Label><Label x={670} y={300}>切り分けたチップ</Label>
   </>:<>
     <rect x={110} y={174} width={94} height={94} fill={blue}/>
     <Label x={70} y={321}>H100の内部チップ</Label><Label x={87} y={358} size={28} color={blue}>約3cm四方</Label>
     <rect x={564} y={101} width={222} height={222} fill="#d5b97a"/>
     {Array.from({length:6},(_,i)=><path key={i} d={`M ${580+i*36} 110 V 314 M 573 ${118+i*36} H 778`} stroke="#a28a56"/>)}
     <Label x={821} y={213} color="#e3cb95">Cerebras</Label><Label x={821} y={251} color="#e3cb95" size={28}>20cm超</Label>
     <Label x={553} y={359}>巨大な1枚のチップ</Label>
   </>}
   <Label x={40} y={429} size={18} color={muted}>{size?"寸法表記は本編音声の概数。図は同縮尺ではありません。":"製造と切り分けの概念図。実物写真ではありません。"}</Label>
 </>;
};

const Bypass: React.FC = () => <>
  <Label x={40} y={56} size={32}>一部に問題があっても、避けて進む</Label>
  {Array.from({length:21},(_,i)=><rect key={i} x={70+i%7*80} y={99+Math.floor(i/7)*85} width={63} height={65} fill={i===10?"#884652":"#2c4652"}/>)}
  <path d="M 321 191 l 35 35 M 356 191 l -35 35" stroke="#ffc2c2" strokeWidth={5}/>
  <Arrow d="M 101 215 H 273 V 132 H 433 V 215 H 577 l -17 -13 M 577 215 l -17 13"/>
  <Label x={692} y={177} color="#ffc2c2">問題のある場所</Label>
  <Label x={692} y={231} color={mint}>使える経路へ迂回</Label>
  <Label x={70} y={393} size={23}>道路の工事区間を、隣の道で避けるイメージ</Label>
  <Label x={70} y={426} size={18} color={muted}>説明用の模式図。実際の回路配置を示すものではありません。</Label>
</>;

const Slide: React.FC<{kind:string;from:number}> = ({kind,from}) => {
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=(frame+from)/fps;
 // Keep adjoining explanation panels open; reopen only after background intervals.
 const cue=cues.find(c=>Math.round(c.startSeconds*fps)===from)!;
 const endFrame=Math.round(cue.endSeconds*fps)-from;
 const remaining=endFrame-1-frame;
 const expandEntry=cue.id!=="classrooms-main" && kind!=="wafer";
 const closeExit=cue.id!=="cpu-gpu" && cue.id!=="classrooms-main";
 const entryFrame=kind==="wafer"?frame-(Math.round(286.767*fps)-from):frame;
 const ease=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
 const panelOpen=Math.min(expandEntry?ease(entryFrame/8):1,closeExit?ease(remaining/8):1);
 const contentIn=ease((entryFrame-(expandEntry?8:0))/6);
 const contentOut=ease((remaining-(closeExit?8:0))/6);
 // The photo ends at global frame 8603 (04:46.767 at 30fps).
 if(kind==="wafer" && frame+from<Math.round(286.767*fps)) return <Img
   data-episode2-slide="photo"
   src={staticFile(
     "Episode2/cerebras-nvidia.png",
   )}
   style={{
     position: "absolute",
     left: 120,
     top: 50,
     width: 1040,
     height: 440,
     objectFit: "contain",
     backgroundColor:
       "rgba(0, 0, 0, 0.8)",
     backgroundImage:
       "none",
     backgroundPosition:
       "0% 0%",
     backgroundSize:
       "auto auto",
     backgroundRepeat:
       "repeat",
     backgroundOrigin:
       "padding-box",
     backgroundClip:
       "border-box",
     backgroundAttachment:
       "scroll",
   }}
 />;
 return <svg data-episode2-slide={kind} viewBox="0 0 1040 440" style={{position:"absolute",left:120,top:50,width:1040,height:440,fontFamily:'Arial, "Yu Gothic", sans-serif',background:"rgba(13,24,36,0.90)",borderLeft:"2px solid #82e4c3",clipPath:`inset(0 ${(1-panelOpen)*50}%)`}}>
   <g opacity={Math.min(contentIn,contentOut)}>
   {kind==="jobs"?<Jobs time={time}/>:kind==="classrooms"?<Classrooms time={time}/>:kind==="wafer"?<Wafer time={time}/>:<Bypass/>}
   </g>
 </svg>;
};

// Each cue is independently editable/removable; no audio or subtitle processing here.
export const Episode2Slides: React.FC = () => {
 const {fps}=useVideoConfig();
 return <>{cues.filter(c=>c.enabled).map(c=>{const from=Math.round(c.startSeconds*fps);return <Sequence key={c.id} from={from} durationInFrames={Math.round(c.endSeconds*fps)-from} name={`図解 ${c.id}`} layout="none"><Slide kind={c.kind} from={from}/></Sequence>;})}</>;
};
