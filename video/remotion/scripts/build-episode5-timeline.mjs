import fs from "node:fs";
import {createHash} from "node:crypto";
import {parseMedia} from "@remotion/media-parser";
import {nodeReader} from "@remotion/media-parser/node";

const fps = 30;
const interClipGapFrames = 6;
const count = 7;
const cutPoints = JSON.parse(fs.readFileSync("docs/episode5/cut-points.json", "utf8"));
const hash = (file) =>
  createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const segments = [];
const files = [];
let from = 0;

for (let number = 1; number <= count; number += 1) {
  const id = String(number).padStart(2, "0");
  const file = `public/episode5/${number}.mp3`;
  const info = await parseMedia({
    src: file,
    reader: nodeReader,
    fields: {
      durationInSeconds: true,
      size: true,
      audioCodec: true,
      sampleRate: true,
      numberOfAudioChannels: true,
    },
    acknowledgeRemotionLicense: true,
  });
  if (!info.durationInSeconds || info.audioCodec !== "mp3" || !info.sampleRate) {
    throw new Error(`Unexpected audio format: ${file}`);
  }

  const cut = cutPoints.files.find((item) => item.id === id);
  if (!cut || cut.startSeconds < 0 || cut.endSeconds > info.durationInSeconds || cut.startSeconds >= cut.endSeconds) {
    throw new Error(`Invalid cut points: ${id}`);
  }
  const durationInFrames = Math.round(cut.endSeconds * fps) - Math.round(cut.startSeconds * fps);
  const gapAfterFrames = number === count ? 0 : interClipGapFrames;
  segments.push({
    id,
    audio: `episode5/${number}.mp3`,
    from,
    durationInFrames,
    audioDurationSeconds: info.durationInSeconds,
    audioStartSeconds: cut.startSeconds,
    audioEndSeconds: cut.endSeconds,
    gapAfterFrames,
  });
  files.push({
    id,
    file,
    sha256: hash(file),
    bytes: info.size,
    durationSeconds: info.durationInSeconds,
    codec: info.audioCodec,
    sampleRate: info.sampleRate,
    channels: info.numberOfAudioChannels,
  });
  from += durationInFrames + gapAfterFrames;
}

fs.mkdirSync("src/episode5", {recursive: true});
fs.mkdirSync("docs/episode5", {recursive: true});
fs.writeFileSync("src/episode5/timeline.json", `${JSON.stringify({
  fps,
  width: 1280,
  height: 720,
  durationInFrames: from,
  interClipGapFrames,
  segments,
}, null, 2)}\n`);
fs.writeFileSync("docs/episode5/audio-inventory.json", `${JSON.stringify({
  source: "Supplied Episode 005 narration; no trimming or processing",
  totalAudioSeconds: files.reduce((sum, item) => sum + item.durationSeconds, 0),
  editedAudioSeconds: segments.reduce((sum, item) => sum + item.audioEndSeconds - item.audioStartSeconds, 0),
  insertedSilenceSeconds: ((count - 1) * interClipGapFrames) / fps,
  files,
}, null, 2)}\n`);

console.log(JSON.stringify({
  files: files.length,
  totalAudioSeconds: files.reduce((sum, item) => sum + item.durationSeconds, 0),
  insertedSilenceSeconds: ((count - 1) * interClipGapFrames) / fps,
  durationInFrames: from,
  durationSeconds: from / fps,
  formats: files.map(({sampleRate, channels}) => `${sampleRate}Hz/${channels}ch`),
}));
