import fs from "node:fs/promises";
import {createHash} from "node:crypto";
import "dotenv/config";

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing");

const hash = (data) => createHash("sha256").update(data).digest("hex");
const localByHash = new Map();
for (let number = 1; number <= 19; number += 1) {
  const audioPath = `public/episode4/${number}.mp3`;
  const audio = await fs.readFile(audioPath);
  localByHash.set(hash(audio), {number, audioPath, bytes: audio.byteLength});
}

const listUrl = new URL("https://api.elevenlabs.io/v1/history");
listUrl.searchParams.set("page_size", "100");
listUrl.searchParams.set("source", "TTS");
listUrl.searchParams.set("sort_direction", "desc");
const listResponse = await fetch(listUrl, {
  headers: {"xi-api-key": apiKey},
  signal: AbortSignal.timeout(180000),
});
if (!listResponse.ok) {
  throw new Error(`History list: HTTP ${listResponse.status}`);
}
const history = await listResponse.json();
const matches = [];

for (const item of history.history) {
  const audioResponse = await fetch(
    `https://api.elevenlabs.io/v1/history/${item.history_item_id}/audio`,
    {
      headers: {"xi-api-key": apiKey},
      signal: AbortSignal.timeout(180000),
    },
  );
  if (!audioResponse.ok) {
    throw new Error(
      `History audio ${item.history_item_id}: HTTP ${audioResponse.status}`,
    );
  }
  const audio = Buffer.from(await audioResponse.arrayBuffer());
  const audioSha256 = hash(audio);
  const local = localByHash.get(audioSha256);
  if (!local) continue;

  matches.push({
    number: local.number,
    audioPath: local.audioPath,
    audioBytes: local.bytes,
    audioSha256,
    historyItemId: item.history_item_id,
    dateUnix: item.date_unix,
    modelId: item.model_id,
    voiceName: item.voice_name,
    source: item.source,
    text: item.text,
  });
  localByHash.delete(audioSha256);
  console.log(`Matched ${local.number.toString().padStart(2, "0")}`);
  if (localByHash.size === 0) break;
}

matches.sort((a, b) => a.number - b.number);
await fs.writeFile(
  "docs/episode4/history-matches.json",
  `${JSON.stringify(
    {
      matched: matches.length,
      scanned: history.history.length,
      unmatchedAudioNumbers: [...localByHash.values()].map((item) => item.number),
      matches,
    },
    null,
    2,
  )}\n`,
  {flag: "wx"},
);

if (matches.length !== 19) {
  throw new Error(
    `Only ${matches.length}/19 local files matched the latest ${history.history.length} history items`,
  );
}
console.log("Matched 19/19; local audio files were read only");
