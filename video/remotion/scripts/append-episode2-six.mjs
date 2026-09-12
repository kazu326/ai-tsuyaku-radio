import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const timeline=read('src/episode2/timeline.json');
if(timeline.segments.length!==5)throw Error('Requires unchanged five-audio timeline; never append twice');
const old=read('src/episode2/captions.json');
const a=read('docs/episode2/alignment-06.json');
const chars=a.characters.filter(c=>!/[\r\n]/u.test(c.text));
const text=fs.readFileSync('docs/episode2/spoken-text-06.txt','utf8').replace(/[\r\n]/g,'');
if(chars.map(c=>c.text).join('')!==text)throw Error('Text mismatch');
function split(s){
 if(s.length<=56)return [s];
 const cuts=[...s.matchAll(/、/g)].map(m=>m.index+1).filter(n=>n>=12&&n<=56);
 if(!cuts.length){ const marker=s.includes('くらいで')?'くらいで':s.includes('少し見え方')?'少し見え方':null; if(!marker)throw Error('Needs manual sentence boundary: '+s); const n=s.indexOf(marker); return [...split(s.slice(0,n)),...split(s.slice(n))]; }
 const cut=cuts.reduce((a,b)=>Math.abs(a-s.length/2)<Math.abs(b-s.length/2)?a:b);
 return [...split(s.slice(0,cut)),...split(s.slice(cut))];
}
const raw=[],added=[],layout=[];let cursor=0;
for(const block of (text.match(/[^。！？!?]+[。！？!?]*[」』]?/gu)??[]).flatMap(split)){
 const slice=chars.slice(cursor,cursor+[...block].length);cursor+=slice.length;
 if(slice.map(c=>c.text).join('')!==block)throw Error('Mapping mismatch');
 let displayText=block;
 if(block.length>28){
  const words=[...new Intl.Segmenter('ja',{granularity:'word'}).segment(block)];
  const candidates=words.map(w=>w.index).filter(n=>n>=block.length-28&&n<=28&&n>0&&!/^[、。！？]/u.test(block.slice(n)));
  const cut=candidates.length?candidates.reduce((a,b)=>Math.abs(a-block.length/2)<Math.abs(b-block.length/2)?a:b):Math.ceil(block.length/2);
  displayText=block.slice(0,cut)+'\n'+block.slice(cut);
  layout.push({text:block,displayText});
 }
 const c={text:block,startMs:timeline.durationInFrames/30*1000+slice[0].start*1000,endMs:timeline.durationInFrames/30*1000+slice.at(-1).end*1000,timestampMs:null,confidence:null};
 raw.push(c);added.push({...c,text:displayText,startMs:Math.max(0,c.startMs-300)});
}
if(cursor!==chars.length)throw Error('Incomplete coverage');
write('docs/episode2/captions-unshifted-06.json',raw);
write('src/episode2/caption-layout-06.json',layout);
write('src/episode2/captions.json',[...old,...added]);
timeline.segments.push({id:'06',audio:'Episode2/6.mp3',from:timeline.durationInFrames,durationInFrames:3739,audioDurationSeconds:5495040/44100,gapAfterFrames:0});
timeline.durationInFrames+=3739;
write('src/episode2/timeline.json',timeline);
console.log(JSON.stringify({old:old.length,added:added.length,frames:timeline.durationInFrames}));

