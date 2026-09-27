import fs from "node:fs/promises";
import {createHash} from "node:crypto";
import "dotenv/config";

const audioPath = "public/episode6/shortstory.mp3";
const output = "docs/episode6/stt-shortstory.json";
const metaPath = `${output}.meta.json`;
const endpoint = "https://api.elevenlabs.io/v1/speech-to-text";
const options = {
  model_id: "scribe_v2",
  language_code: "ja",
  timestamps_granularity: "word",
  tag_audio_events: "false",
  diarize: "false",
};
const hash = (data) => createHash("sha256").update(data).digest("hex");
const audio = await fs.readFile(audioPath);
try {
  const cached = await fs.readFile(output);
  const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
  if (meta.audioSha256 !== hash(audio) || meta.responseSha256 !== hash(cached)) {
    throw new Error("Shortstory cache differs");
  }
  console.log("Reusing shortstory STT");
  process.exit(0);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing");
const form = new FormData();
form.append("file", new Blob([audio], {type: "audio/mpeg"}), "shortstory.mp3");
for (const [key, value] of Object.entries(options)) form.append(key, value);
const response = await fetch(endpoint, {
  method: "POST",
  headers: {"xi-api-key": apiKey},
  body: form,
  signal: AbortSignal.timeout(180000),
});
if (!response.ok) throw new Error(`Shortstory STT: HTTP ${response.status}`);
const raw = await response.text();
await fs.writeFile(output, raw, {flag: "wx"});
await fs.writeFile(metaPath, `${JSON.stringify({
  audioPath,
  audioSha256: hash(audio),
  endpoint,
  options,
  createdAt: new Date().toISOString(),
  responseSha256: hash(raw),
}, null, 2)}\n`, {flag: "wx"});
const result = JSON.parse(raw);
console.log(JSON.stringify({language: result.language_code, words: result.words?.length, duration: result.audio_duration_secs}));
