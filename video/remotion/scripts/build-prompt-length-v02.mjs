import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

// Offline conversion only: no network, ASR, or model inference.
const alignment = JSON.parse(await fs.readFile('docs/prompt-length-test/v02-alignment.json','utf8'));
const baseline = JSON.parse(await fs.readFile('src/prompt-length/captions.json','utf8'));
const accepted = await fs.readFile('docs/prompt-length-test/accepted.txt','utf8');
const compact = (s) => s.replace(/\s/gu,'');
assert.equal(baseline.map(c=>compact(c.text)).join(''),compact(accepted),'Caption text differs from accepted text');
const chars = alignment.characters.flatMap(c => [...c.text].filter(t=>! /\s/u.test(t)).map(text=>({...c,text})));
assert.equal(chars.map(c=>c.text).join(''),compact(accepted),'Alignment text mismatch; stop instead of guessing');
for(const c of chars) assert(Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>=c.start&&c.end<=87.249,'Invalid character times');
let offset=0;
const captions=baseline.map(c=>{
  const count=[...compact(c.text)].length;
  const block=chars.slice(offset,offset+count); offset+=count;
  // V01's mapping excludes punctuation; keep the same spoken-boundary convention.
  const spoken=block.filter(c=>/[\p{L}\p{N}]/u.test(c.text));
  assert(spoken.length>0);
  return {...c,startMs:Math.round(spoken[0].start*1000),endMs:Math.round(spoken.at(-1).end*1000)};
});
for(let i=0;i<captions.length;i++){
  captions[i].endMs=Math.min(captions[i].endMs+150,captions[i+1]?.startMs??87249);
  assert(captions[i].endMs>captions[i].startMs,'Nonpositive block duration');
  assert(i===0||captions[i].startMs>=captions[i-1].endMs,'Overlapping blocks');
}
const rows=captions.map((c,i)=>({block:i+1,text:c.text,v01StartMs:baseline[i].startMs,v02StartMs:c.startMs,startDeltaMs:c.startMs-baseline[i].startMs,v01EndMs:baseline[i].endMs,v02EndMs:c.endMs,endDeltaMs:c.endMs-baseline[i].endMs}));
const deltas=rows.flatMap(r=>[Math.abs(r.startDeltaMs),Math.abs(r.endDeltaMs)]);
const summary={blocks:captions.length,meanAbsoluteBoundaryDeltaMs:deltas.reduce((a,b)=>a+b,0)/deltas.length,maxAbsoluteBoundaryDeltaMs:Math.max(...deltas),note:'Timing difference is not accuracy. Human listening evaluation is required.'};
await fs.writeFile('src/prompt-length/captions-v02.json',JSON.stringify(captions,null,2)+'\n');
await fs.writeFile('docs/prompt-length-test/v02-comparison.json',JSON.stringify({summary,rows},null,2)+'\n');
const md=['# V01 r02 / V02 字幕時刻比較','','差分はV02−V01。正は遅く、負は早く表示。精度の正解を示す数値ではありません。','','|区間|本文|V01開始→終了 秒|V02開始→終了 秒|開始差 ms|終了差 ms|','|---|---|---|---|---|---|',...rows.map(r=>`|${r.block}|${r.text}|${r.v01StartMs/1000}→${r.v01EndMs/1000}|${r.v02StartMs/1000}→${r.v02EndMs/1000}|${r.startDeltaMs}|${r.endDeltaMs}|`),'','## 優先して試聴する区間','',...rows.toSorted((a,b)=>Math.max(Math.abs(b.startDeltaMs),Math.abs(b.endDeltaMs))-Math.max(Math.abs(a.startDeltaMs),Math.abs(a.endDeltaMs))).slice(0,5).map(r=>`- 区間${r.block}：${r.text}（${Math.max(0,Math.min(r.v01StartMs,r.v02StartMs)/1000-1)}秒付近から）`),''];
await fs.writeFile('docs/prompt-length-test/v02-comparison.md',md.join('\n'));
const source=await fs.readFile('src/prompt-length/PromptLengthTest.tsx','utf8');
const v02=source.replace('./captions.json','./captions-v02.json').replaceAll('PromptLengthTest','PromptLengthTestV02').replace('PromptLengthComposition','PromptLengthCompositionV02').replace('AI-Radio-PromptLength-v01','AI-Radio-PromptLength-v02');
await fs.writeFile('src/prompt-length/PromptLengthTestV02.tsx',v02);
console.log(JSON.stringify(summary));
