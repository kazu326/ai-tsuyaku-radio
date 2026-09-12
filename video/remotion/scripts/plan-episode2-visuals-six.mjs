import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='docs/episode2/';
const read=(p)=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=(p)=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(dir+p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const timeline=read('src/episode2/timeline.json');
const segments=[...timeline.segments,{id:'06',audio:'Episode2/6.mp3',from:13945,durationInFrames:3739,audioDurationSeconds:5495040/44100}];
const normalize=(s)=>s.replace(/\s/gu,'');
const checks=[],sentences=[];
for(const s of segments){
 const file=dir+(s.id==='06'?'alignment-06.json':'alignment-r02-'+s.id+'.json');
 const a=read(file),meta=read(file+'.meta.json'),spoken=fs.readFileSync(dir+'spoken-text-'+s.id+'.txt','utf8');
 const chars=a.characters,lex=chars.filter(c=>/[\p{L}\p{N}]/u.test(c.text));
 const counts=new Map(),bins=Array(10).fill(0);
 let invalid=0,reverse=0;
 chars.forEach((c,i)=>{if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<c.start||c.end>s.audioDurationSeconds+0.001)invalid++;if(i&&(c.start<chars[i-1].start||c.end<chars[i-1].end))reverse++;});
 lex.forEach(c=>{counts.set(c.start,(counts.get(c.start)||0)+1);bins[Math.min(9,Math.max(0,Math.floor(c.start/s.audioDurationSeconds*10)))]++;});
 const maxSame=Math.max(...counts.values());
 const lastSecond=lex.filter(c=>c.start>=s.audioDurationSeconds-1).length;
 const textMatch=normalize(chars.map(c=>c.text).join(''))===normalize(spoken);
 const cache=meta.audioSha256===hash('public/'+s.audio)&&meta.textSha256===hash(dir+'spoken-text-'+s.id+'.txt')&&meta.responseSha256===hash(file);
 const stt=read(dir+'stt-'+s.id+'.json');
 const sttWords=stt.words.filter(x=>x.type==='word');
 checks.push({id:s.id,alignment:file,audioDurationSeconds:s.audioDurationSeconds,loss:a.loss,fullTextMatches:textMatch,cacheIntegrity:cache,invalidTimes:invalid,reversedTimes:reverse,maxLettersAtSameStart:maxSame,lexicalCharactersPerDecile:bins,lettersInLastSecond:lastSecond,firstSpeech:lex[0].start,lastSpeech:lex.at(-1).end,sttFirstSpeech:sttWords[0].start,sttLastSpeech:sttWords.at(-1).end,passed:textMatch&&cache&&!invalid&&!reverse&&maxSame<=3&&bins.every(n=>n>0)&&lastSecond<25});
 // JS string indices are UTF-16; preserve alignment indices even for supplementary characters.
 const clean=chars.filter(c=>!/[\r\n]/u.test(c.text));const lookup=[];
 for(const c of clean)for(let k=0;k<c.text.length;k++)lookup.push(c);
 const text=clean.map(c=>c.text).join('');
 for(const m of text.matchAll(/[^。！？!?]+[。！？!?]*/gu)){
  const first=lookup[m.index],last=lookup[m.index+m[0].length-1];
  sentences.push({audio:s.id,text:m[0],localStart:first.start,localEnd:last.end,start:s.from/30+first.start,end:s.from/30+last.end});
 }
}
if(checks.some(c=>!c.passed))throw Error('Alignment check failed: '+JSON.stringify(checks.filter(c=>!c.passed)));
write('alignment-six-verification.json',{checks,method:'Raw character timings; punctuation excluded from concentration statistics; same-start <=3, last-second <25 lexical characters, all deciles occupied. These are anomaly screens, not a listening certification.'});
write('spoken-timing-six.json',{fps:30,timelineStatus:'Proposed append of 06; production composition unchanged',segments,sentences});
const stt=read(dir+'stt-06.json');
write('stt-verification-06.json',{sourceOfTruth:'public/Episode2/6.mp3',referenceOnly:'script-06.txt',method:'ElevenLabs scribe_v2, Japanese, followed by forced alignment',edits:[{from:'一つ',to:'1つ',count:(stt.text.match(/一つ/g)||[]).length},'Sentence line breaks only'],rawTextMatchesAfterPermittedEdits:normalize(stt.text.replaceAll('一つ','1つ'))===normalize(fs.readFileSync(dir+'spoken-text-06.txt','utf8')),audioDurationSeconds:5495040/44100,sttFirst:stt.words.find(w=>w.type==='word').start,sttLast:stt.words.filter(w=>w.type==='word').at(-1).end,manualFullListening:false,notes:['冒頭の言い直しを保持','まとめ。エンディング。も文字起こし結果のまま保持','STTとFAは同一サービスによるため独立した聴取検証ではない']});
const rows=[
 [0,'導入・前回の紹介','不要','背景を継続','なし'],
 [11.380,'GPT 5.6ソル／最大14倍／最大750トークン毎秒','任意','モデル名と性能値を別の欄に。14倍の比較条件は未検証なので棒グラフにしない','任意スライド S0'],
 [22.719,'Cerebrasとの出会い・今回の問い','不要','背景を継続。ここでは説明図を先取りしない','なし'],
 [72.646,'GPUの話への導入','不要','背景を継続','なし'],
 [105.467,'CPUは器用な委員長／GPUは大人数で同種計算','必要・高','左に委員長と複数種類の仕事、右に生徒群と同じ計算。118.706秒で右側追加、130.886秒でAIとの相性を強調','Remotion S1'],
 [154.232,'GPUをさらに増やす','必要・高','教室を1室→複数室へ。100人・1000人・1万人はラベルで示し、実数の人物を描かない','Remotion S2・導入'],
 [183.972,'教室が分かれるとプリント移動が必要','必要・高','同じ図を維持。194.053秒で机同士、197.092秒で廊下経由の矢印。209.292秒からプリントをデータに対応付ける','Remotion S2・更新'],
 [223.132,'計算場所までデータを運ぶ大変さ','必要・継続','同一図を保持し「計算」と「データ移動」の2要素だけ残す','Remotion S2・保持'],
 [237.060,'壁を取っ払い、近い場所でやり取り','必要・高','S2の壁を外し短い経路に更新。251.080秒で壁除去、260.500秒で近距離の矢印','Remotion S2・更新'],
 [278.860,'実物を見ると大きい／画像を見てもらいたい','必要・最優先','既存cerebras-nvidia.pngを実物の外観として表示。右の基板全体をGPU内部チップの寸法と混同しない','既存画像'],
 [286.760,'丸いウェハに小さなチップを作り切り分ける','必要・高','丸い板→格子→小片の簡素な模式図。巨大チップを丸いウェハそのものと誤認させない','Remotion S3・製造イメージ'],
 [304.580,'H100内部チップ約3cm四方／20cm超の巨大チップ','必要・最優先','音声で述べた概数の寸法ラベル＋模式図。既存写真は同縮尺の証拠にしない。寸法の出典確認前に厳密な面積比を描かない','Remotion S3・サイズ比較＋既存画像'],
 [327.780,'大きくしてよいのか／1つの空間にまとめる','必要・継続','サイズ図を閉じ、332.370秒からS2の広い教室を再表示。346.260秒で短い経路を強調','Remotion S2・再利用'],
 [362.207,'大きいチップは一部失敗したら全部アウトか','不要','いったん背景へ戻り、疑問を聞かせる','なし'],
 [389.247,'一部に問題があっても避ける／道路の迂回','必要・高','格子の1区画を問題箇所として示し、矢印を隣へ迂回。実際の回路配置ではなく比喩と明記','Remotion S4'],
 [414.386,'寄り道から戻る','不要','S4を閉じ背景へ','なし'],
 [424.466,'モデルだけでなく動かすコンピューターで体験が変わる','任意','同じモデルのカードを固定し、その下の実行環境だけを変える。速度の新しい数値は足さない','任意Remotion S5'],
 [465.093,'ここからは僕の解釈／合わせる方向が逆になる','任意','S5を使う場合は「話者の解釈」と表示。479.033秒に既存環境→AI、487.553秒にAIの要件→専用コンピューター','任意Remotion S5・更新'],
 [505.893,'まとめ。エンディング。／今回のまとめ導入','不要','背景を継続。この発話を勝手に削らない。編集上残すかは人間が判断','なし'],
 [514.713,'小さく切り分けた計算場所を大きく1つに','必要・再利用','S2を短く再表示。教室→壁なし→短距離のデータ移動の3状態で復習','Remotion S2・再利用'],
 [548.233,'Ultra Fastの見え方が変わる','不要','復習図を閉じ背景へ','なし'],
 [557.633,'チップ製造／装置／材料／検査と日本企業','任意・低','中心チップの周囲に製造・装置・材料・検査の4ラベル。直列工程や特定企業の役割は推測しない','任意Remotion S6'],
 [576.833,'日本企業・次回予告・挨拶','不要','背景を継続。別途接続するEnding動画は今回扱わない','なし'],
];
const total=17684/30;
const fmt=s=>{const ms=Math.round(s*1000);return String(Math.floor(ms/60000)).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(ms%1000).padStart(3,'0');};
const map=rows.map((r,i)=>({id:i+1,start:r[0],end:rows[i+1]?.[0]??total,topic:r[1],need:r[2],show:r[3],asset:r[4],humanEdit:r[2]==='不要'?'挿入なし':'後工程で人間が採否・表示尺を決定して挿入',spoken:sentences.filter(s=>s.start>=r[0]-0.001&&s.start<(rows[i+1]?.[0]??total)-0.001)}));
write('visual-insertion-map-v01.json',{status:'Plan only; no rendering or composition changes',timeBasis:'Main-only, raw FA plus existing frame-aligned audio starts; sixth proposed at frame 13945; no V03 shift on map',durationSeconds:total,segments:map});
let md='# 第2話・6音声の映像挿入マップ v01\n\n計画書のみ。Composition、字幕、音声、既存Alignment、背景、猫、完成MP4は変更していない。第2話限定で完成音声をSource of Truthとし、scriptは参考資料として保持。第3話以降の標準手順は変更しない。\n\n## 時刻の基準\n\n本編0秒基準。音声1〜5は現在のtimeline.jsonの開始フレームを使用。音声6はフレーム13945（07:44.833）へ隙間なしで追加する仮設計。6の実音声尺124.604082秒、30fpsへ切り上げた予定全尺09:49.467。現在の本番は5本・07:44.833のまま。\n\n下表は映像を検討する区間で、終端は次区間の開始（半開区間）。発話の正確な開始・終了と原文はspoken-timing-six.json／mdを参照。字幕の開始300ms前倒しはこの発話時刻には適用しない。約43msの差も修正しない。Opening・別途の導入・Ending素材は計画対象外。\n\n## 挿入一覧\n\n発話欄は原文抜粋。全文と音声内時刻は別添に保持。必要な図も自動挿入せず、後工程で人間が判断する。\n\n| # | 本編時刻 | 発話内容（抜粋） | 映像が必要か | 何を見せるか | 既存画像／Remotion | 人間編集 |\n|---|---|---|---|---|---|---|\n';
for(const r of map){const excerpt=r.spoken.slice(0,2).map(s=>s.text).join('');md+='| '+r.id+' | '+fmt(r.start)+'–'+fmt(r.end)+' | '+excerpt.replaceAll('|','／')+' | '+r.need+' | '+r.show+' | '+r.asset+' | '+r.humanEdit+' |\n';}
md+='\n## Remotionスライド候補\n\n優先制作は4種類。連続する話では同じ図の要素を更新し、字幕ごとに新規パネルを出さない。効果音・装飾アニメーションは追加候補にしない。\n\n| ID | 候補 | 主な表示区間 | 構成・素材 |\n|---|---|---|---|\n| S1 | CPUとGPUの仕事の配り方 | 01:45.467–02:34.232 | 委員長と多種類の仕事／生徒群と同種計算。性能の厳密比較ではなく学校の比喩 |\n| S2 | 教室・壁・データ移動 | 02:34.232–04:38.860、05:32.370–06:02.207、08:34.713–09:08.233 | 複数室→廊下の移動→壁なし→近い経路。同じ構図を復習にも使う |\n| S3 | ウェハの切り分けとサイズ感 | 04:46.760–05:27.780 | 丸いウェハと切り分け、音声の約3cm／20cm超。実物写真と模式図の役割を分ける |\n| S4 | 不良箇所を避ける | 06:29.247–06:54.386 | 格子＋問題箇所＋迂回矢印。回路の実装を断定しない概念図 |\n\nS0（速度値整理）、S5（モデルと実行環境／設計方向）、S6（製造を支える役割）は任意。初回は背景で聞かせても成立するため、4種類を先に評価する。\n\n## 既存画像と配置\n\npublic/Episode2/cerebras-nvidia.png（800×450）は外観提示に使用候補。右側には基板も写るため、内部チップの約3cm寸法や厳密な同縮尺比較の根拠にはしない。音声で画像を見るよう促す04:38.860–04:46.760とサイズ説明の区間を優先。新しい画像の取得・生成は行わない。\n\n図は1280×720の上部領域（仮にx=120,y=60,w=1040,h=450）で設計し、左下猫と既存字幕の領域を空ける。字幕の位置・外観を変えない。将来スライドを独立素材として作り、人間が編集ソフトで挿入・尺調整できる構成を想定。背景へ戻る間も自由に調整可能とする。\n\n## 6本目の確認と停止地点\n\nSTTの本文から「一つ→1つ」2箇所と改行だけを変更。冒頭の言い直し、「まとめ。エンディング。」は保持した。STTとFAの時刻整合、全文一致、時間分布は機械検査済み。人間の全編聴取による誤認識ゼロの保証ではない。Alignmentで正しい日本語認識そのものを証明できるわけではない。\n\n今回の成果は6の文字起こし・Alignment・検査記録・本マップ。6の本番組み込み、V03字幕生成、スライド制作、レンダリングは未実施。人間の採否判断待ちで停止。\n';
write('visual-insertion-map-v01.md',md);
write('spoken-timing-six.md','# 第2話・発話時刻一覧\n\n生Alignment時刻。6は既存5本の後への仮接続。\n\n| 音声 | 音声内 | 本編内（予定） | 発話原文 |\n|---|---|---|---|\n'+sentences.map(s=>'| '+s.audio+' | '+fmt(s.localStart)+'–'+fmt(s.localEnd)+' | '+fmt(s.start)+'–'+fmt(s.end)+' | '+s.text.replaceAll('|','／')+' |').join('\n')+'\n');
console.log(JSON.stringify({checks:checks.map(c=>({id:c.id,passed:c.passed,bins:c.lexicalCharactersPerDecile,first:c.firstSpeech,last:c.lastSpeech,maxSame:c.maxLettersAtSameStart,lastSecond:c.lettersInLastSecond})),sentences:sentences.length,mapRows:map.length}));
