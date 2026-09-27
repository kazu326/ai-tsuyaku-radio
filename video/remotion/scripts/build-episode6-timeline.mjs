import fs from "node:fs";

const fps = 30;
const segments = [];
let from = 0;

for (let number = 1; number <= 5; number += 1) {
  const audio = `episode6/${number}.mp3`;
  const stt = JSON.parse(fs.readFileSync(`docs/episode6/stt-${String(number).padStart(2, "0")}.json`, "utf8"));
  const durationSeconds = stt.audio_duration_secs;
  if (!fs.existsSync(`public/${audio}`) || !Number.isFinite(durationSeconds)) {
    throw new Error(`Missing audio or measured duration: ${audio}`);
  }
  const durationInFrames = Math.round(durationSeconds * fps);
  segments.push({
    id: String(number).padStart(2, "0"),
    audio,
    from,
    durationInFrames,
    audioDurationSeconds: durationSeconds,
  });
  from += durationInFrames;
}

fs.mkdirSync("src/episode6", {recursive: true});
fs.writeFileSync("src/episode6/timeline.json", `${JSON.stringify({
  fps,
  width: 1920,
  height: 1080,
  durationInFrames: from,
  interClipGapFrames: 0,
  segments,
}, null, 2)}\n`);
console.log(JSON.stringify({durationInFrames: from, durationSeconds: from / fps, segments}));
