import fs from "node:fs";
import { createHash } from "node:crypto";

const fps = 30;
const gapAfterFrames = 6; // 200ms at 30fps, between supplied clips only.
const durations = [
  24.842438, 21.629375, 31.869375, 42.266063, 34.768938, 44.591,
  43.964063, 62.1975, 49.319125, 67.970563, 64.444063, 76.199125,
];
const hash = (file) =>
  createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const captions = [];
const rawCaptions = [];
const segments = [];
const checks = [];
const spokenTiming = [];
let from = 0;

const characterCount = (text) => [...text].length;

// Sentence boundaries first; split long speech only at punctuation already in the approved script.
function blocks(text) {
  const sentences = text.match(/[^。！？!?]+[。！？!?]*[」』]?/gu) ?? [];
  return sentences.flatMap(function split(sentence) {
    if (characterCount(sentence) <= 56) return [sentence];
    const chars = [...sentence];
    const candidates = chars
      .map((char, index) => (/[、，]/u.test(char) ? index + 1 : -1))
      .filter((index) => index >= 18 && index <= 50);
    if (!candidates.length) {
      throw new Error(`Manual caption boundary required: ${sentence}`);
    }
    const target = Math.min(38, Math.round(chars.length / 2));
    const cut = candidates.reduce((a, b) =>
      Math.abs(a - target) < Math.abs(b - target) ? a : b,
    );
    return [...split(chars.slice(0, cut).join("")), ...split(chars.slice(cut).join(""))];
  });
}

function displayText(text) {
  const chars = [...text];
  if (chars.length <= 35) return text;
  const candidates = chars
    .map((char, index) => (/[、，。！？!?]/u.test(char) ? index + 1 : -1))
    .filter((index) => index >= 18 && chars.length - index >= 8);
  if (!candidates.length) return text;
  const target = Math.min(35, Math.round(chars.length * 0.58));
  const cut = candidates.reduce((a, b) =>
    Math.abs(a - target) < Math.abs(b - target) ? a : b,
  );
  return `${chars.slice(0, cut).join("")}\n${chars.slice(cut).join("")}`;
}

for (let index = 0; index < 12; index += 1) {
  const id = String(index + 1).padStart(2, "0");
  const audioPath = `public/episode3/${index + 1}.mp3`;
  const alignmentPath = `docs/episode3/alignment-${id}.json`;
  const textPath = `docs/episode3/spoken-text-${id}.txt`;
  const sttPath = `docs/episode3/stt-${id}.json`;
  const alignment = read(alignmentPath);
  const meta = read(`${alignmentPath}.meta.json`);
  const text = fs.readFileSync(textPath, "utf8").replace(/[\r\n]/g, "");
  const characters = alignment.characters.filter(
    (character) => !/^[\r\n]+$/.test(character.text),
  );
  const lexical = characters.filter((character) =>
    /[\p{L}\p{N}]/u.test(character.text),
  );
  const grouped = new Map();
  for (const character of lexical) {
    grouped.set(character.start, (grouped.get(character.start) ?? 0) + 1);
  }
  const bins = Array.from({ length: 10 }, (_, bin) =>
    lexical.filter(
      (character) =>
        Math.min(9, Math.floor((character.start / durations[index]) * 10)) === bin,
    ).length,
  );
  const invalid = characters.filter(
    (character) =>
      !Number.isFinite(character.start) ||
      !Number.isFinite(character.end) ||
      character.start < 0 ||
      character.end < character.start ||
      character.end > durations[index],
  );
  const reversed = characters.filter(
    (character, characterIndex) =>
      characterIndex > 0 &&
      (character.start < characters[characterIndex - 1].start ||
        character.end < characters[characterIndex - 1].end),
  );
  const sttWords = read(sttPath).words.filter((word) => word.type === "word");
  const check = {
    id,
    loss: alignment.loss,
    fullTextMatches: characters.map((character) => character.text).join("") === text,
    cacheIntegrity:
      hash(audioPath) === meta.audioSha256 &&
      hash(textPath) === meta.textSha256 &&
      hash(alignmentPath) === meta.responseSha256,
    invalidTimes: invalid.length,
    reversedTimes: reversed.length,
    maxLettersAtSameStart: Math.max(...grouped.values()),
    lexicalCharactersPerDecile: bins,
    firstTime: characters[0].start,
    lastTime: characters.at(-1).end,
    sttEndDifferenceSeconds: Math.abs(
      characters.at(-1).end - sttWords.at(-1).end,
    ),
  };
  check.passed =
    check.fullTextMatches &&
    check.cacheIntegrity &&
    invalid.length === 0 &&
    reversed.length === 0 &&
    check.maxLettersAtSameStart < 8 &&
    bins.every((count) => count > 0) &&
    check.sttEndDifferenceSeconds < 1;
  checks.push(check);
  if (!check.passed) {
    throw new Error(`Alignment check failed: ${JSON.stringify(check)}`);
  }

  const durationInFrames = Math.ceil(durations[index] * fps);
  const gapFrames = index === 11 ? 0 : gapAfterFrames;
  segments.push({
    id,
    audio: `episode3/${index + 1}.mp3`,
    from,
    durationInFrames,
    audioDurationSeconds: durations[index],
    gapAfterFrames: gapFrames,
  });

  let cursor = 0;
  for (const textBlock of blocks(text)) {
    const size = characterCount(textBlock);
    const slice = characters.slice(cursor, cursor + size);
    if (slice.map((character) => character.text).join("") !== textBlock) {
      throw new Error(`Character mapping mismatch in ${id}: ${textBlock}`);
    }
    const startMs = (from / fps) * 1000 + slice[0].start * 1000;
    const endMs = (from / fps) * 1000 + slice.at(-1).end * 1000;
    const raw = {
      text: textBlock,
      startMs,
      endMs,
      timestampMs: null,
      confidence: null,
    };
    rawCaptions.push(raw);
    captions.push({
      ...raw,
      text: displayText(textBlock),
      startMs: Math.max((from / fps) * 1000, startMs - 300),
    });
    spokenTiming.push({
      audio: id,
      text: textBlock,
      localStart: slice[0].start,
      localEnd: slice.at(-1).end,
      start: startMs / 1000,
      end: endMs / 1000,
    });
    cursor += size;
  }
  if (cursor !== characters.length) {
    throw new Error(`Incomplete text coverage in ${id}`);
  }

  from += durationInFrames + gapFrames;
}

fs.mkdirSync("src/episode3", { recursive: true });
const write = (file, data) =>
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
write("docs/episode3/alignment-verification.json", {
  checks,
  scope:
    "Exact approved text, cache integrity, timing distribution and independent STT endpoint comparison; not human listening approval.",
});
write("docs/episode3/captions-unshifted.json", rawCaptions);
write("docs/episode3/spoken-timing.json", spokenTiming);
write("src/episode3/captions.json", captions);
write("src/episode3/timeline.json", {
  fps,
  width: 1280,
  height: 720,
  durationInFrames: from,
  interClipGapFrames: gapAfterFrames,
  segments,
});

console.log(
  JSON.stringify({
    checks,
    captions: captions.length,
    durationInFrames: from,
    seconds: from / fps,
    insertedSilenceSeconds: ((segments.length - 1) * gapAfterFrames) / fps,
  }),
);
