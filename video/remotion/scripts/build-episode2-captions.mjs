import fs from 'node:fs';
import {createHash} from 'node:crypto';

// Offline only. Always derive from unshifted r02 alignment; never from captions.json.
const fps = 30;
const durations = [72.4375, 81.55425, 82.83425, 125.152625, 102.765688];
const names = ['１.mp3', '２.mp3', '3.mp3', '4.mp3', '5.mp3'];
const hash = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const layoutPath='src/episode2/caption-layout.json';
const layout=new Map((fs.existsSync(layoutPath)?read(layoutPath):[]).map(row=>[row.text,row.displayText]));
const captions = [], rawCaptions = [], segments = [], checks = [];
let from = 0;

// Sentence boundaries first; exceptionally long sentences split at an existing comma.
// Layout breaks preserve every non-whitespace character of the adopted spoken text.
function blocks(text) {
  const sentences = text.match(/[^。！？!?]+[。！？!?]*[」』]?/gu) ?? [];
  return sentences.flatMap(function split(s) {
    if (s.length <= 56) return [s];
    const candidates = [...s.matchAll(/、/g)].map(m => m.index + 1).filter(n => n >= 12 && n <= 56);
    if (!candidates.length) throw new Error(`Manual caption boundary required: ${s}`);
    const cut = candidates.reduce((a,b) => Math.abs(a-s.length/2)<Math.abs(b-s.length/2)?a:b);
    return [...split(s.slice(0,cut)), ...split(s.slice(cut))];
  });
}

for (let i=0; i<5; i++) {
  const id=String(i+1).padStart(2,'0');
  const file=`docs/episode2/alignment-r02-${id}.json`;
  const alignment=read(file), meta=read(`${file}.meta.json`);
  const text=fs.readFileSync(`docs/episode2/spoken-text-${id}.txt`,'utf8').replace(/[\r\n]/g,'');
  const chars=alignment.characters.filter(c=>! /^[\r\n]+$/.test(c.text));
  const lexical=chars.filter(c=>/[\p{L}\p{N}]/u.test(c.text));
  const grouped=new Map();
  for (const c of lexical) grouped.set(c.start,(grouped.get(c.start)??0)+c.text.length);
  const bins=Array.from({length:10},(_,b)=>lexical.filter(c=>Math.min(9,Math.floor(c.start/durations[i]*10))===b).length);
  const invalid=chars.filter(c=>!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<c.start||c.end>durations[i]);
  const reversed=chars.filter((c,j)=>j>0&&(c.start<chars[j-1].start||c.end<chars[j-1].end));
  const stt=read(`docs/episode2/stt-${id}.json`).words.filter(w=>w.type==='word');
  const check={id,loss:alignment.loss,fullTextMatches:chars.map(c=>c.text).join('')===text,
    cacheIntegrity:hash(meta.audioPath)===meta.audioSha256&&hash(meta.textPath)===meta.textSha256&&hash(file)===meta.responseSha256,
    invalidTimes:invalid.length,reversedTimes:reversed.length,maxLettersAtSameStart:Math.max(...grouped.values()),
    lexicalCharactersPerDecile:bins,firstTime:chars[0].start,lastTime:chars.at(-1).end,
    sttEndDifferenceSeconds:Math.abs(chars.at(-1).end-stt.at(-1).end)};
  check.passed=check.fullTextMatches&&check.cacheIntegrity&&!invalid.length&&!reversed.length&&check.maxLettersAtSameStart<8&&bins.every(n=>n>0)&&check.sttEndDifferenceSeconds<1;
  checks.push(check);
  if (!check.passed) throw new Error(`Alignment check failed: ${JSON.stringify(check)}`);
  const durationInFrames=Math.ceil(durations[i]*fps);
  segments.push({id,audio:`Episode2/${names[i]}`,from,durationInFrames,audioDurationSeconds:durations[i],gapAfterFrames:0});
  let cursor=0;
  for(const textBlock of blocks(text)) {
    const size=[...textBlock].length;
    const slice=chars.slice(cursor,cursor+size);
    if(slice.map(c=>c.text).join('')!==textBlock) throw new Error('Character mapping mismatch');
    const raw={text:textBlock,startMs:from/fps*1000+slice[0].start*1000,endMs:from/fps*1000+slice.at(-1).end*1000,timestampMs:null,confidence:null};
    rawCaptions.push(raw);
    const displayText=layout.get(textBlock)??textBlock;
    if(displayText.replace(/\n/g,'')!==textBlock)throw new Error('Layout changed text');
    captions.push({...raw,text:displayText,startMs:Math.max(0,raw.startMs-300)});
    cursor+=size;
  }
  if(cursor!==chars.length)throw new Error('Incomplete text coverage');
  from+=durationInFrames;
}
fs.mkdirSync('src/episode2',{recursive:true});
const write=(f,data)=>fs.writeFileSync(f,JSON.stringify(data,null,2)+'\n');
write('docs/episode2/alignment-r02-verification.json',{checks,scope:'Machine timing distribution, exact text and independent STT endpoint comparison; not human listening approval.'});
write('docs/episode2/captions-unshifted.json',rawCaptions);
write('src/episode2/captions.json',captions);
write('src/episode2/timeline.json',{fps,width:1280,height:720,durationInFrames:from,segments});
console.log(JSON.stringify({checks,captions:captions.length,durationInFrames:from,seconds:from/fps}));
