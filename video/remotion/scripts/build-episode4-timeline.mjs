import fs from "node:fs";
import {createHash} from "node:crypto";
import {parseMedia} from "@remotion/media-parser";
import {nodeReader} from "@remotion/media-parser/node";

const fps = 30;
const interClipGapFrames = 6;
const hash = (file) =>
  createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const segments = [];
const audioInventory = [];
let from = 0;

for (let number = 1; number <= 19; number += 1) {
  const id = String(number).padStart(2, "0");
  const audio = `public/episode4/${number}.mp3`;
  const info = await parseMedia({
    src: audio,
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
  if (!info.durationInSeconds) {
    throw new Error(`Missing duration: ${audio}`);
  }
  if (info.audioCodec !== "mp3" || info.sampleRate !== 44100) {
    throw new Error(`Unexpected audio format: ${audio}`);
  }

  const durationInFrames = Math.ceil(info.durationInSeconds * fps);
  const gapAfterFrames = number === 19 ? 0 : interClipGapFrames;
  segments.push({
    id,
    audio: `episode4/${number}.mp3`,
    from,
    durationInFrames,
    audioDurationSeconds: info.durationInSeconds,
    gapAfterFrames,
  });
  audioInventory.push({
    id,
    file: audio,
    sha256: hash(audio),
    bytes: info.size,
    durationSeconds: info.durationInSeconds,
    codec: info.audioCodec,
    sampleRate: info.sampleRate,
    channels: info.numberOfAudioChannels,
  });
  from += durationInFrames + gapAfterFrames;
}

fs.mkdirSync("src/episode4", {recursive: true});
fs.mkdirSync("docs/episode4", {recursive: true});
fs.writeFileSync(
  "src/episode4/timeline.json",
  `${JSON.stringify(
    {
      fps,
      width: 1280,
      height: 720,
      durationInFrames: from,
      interClipGapFrames,
      segments,
    },
    null,
    2,
  )}\n`,
);
fs.writeFileSync(
  "docs/episode4/audio-inventory.json",
  `${JSON.stringify(
    {
      source: "Supplied Episode 004 narration; no trimming or processing",
      totalAudioSeconds: audioInventory.reduce(
        (sum, item) => sum + item.durationSeconds,
        0,
      ),
      insertedSilenceSeconds:
        ((audioInventory.length - 1) * interClipGapFrames) / fps,
      files: audioInventory,
    },
    null,
    2,
  )}\n`,
);

console.log(
  JSON.stringify({
    files: audioInventory.length,
    totalAudioSeconds: audioInventory.reduce(
      (sum, item) => sum + item.durationSeconds,
      0,
    ),
    insertedSilenceSeconds:
      ((audioInventory.length - 1) * interClipGapFrames) / fps,
    durationInFrames: from,
    durationSeconds: from / fps,
  }),
);
