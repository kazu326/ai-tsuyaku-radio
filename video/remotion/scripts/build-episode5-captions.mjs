import fs from "node:fs";
import {createHash} from "node:crypto";

const sourceTimeline = JSON.parse(
  fs.readFileSync("src/episode5/timeline.json", "utf8"),
);
const {fps, width, height, interClipGapFrames} = sourceTimeline;
const hash = (file) =>
  createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const captions = [];
const rawCaptions = [];
const checks = [];
const spokenTiming = [];
const characterCount = (text) => [...text].length;

// Prefer sentence boundaries; split long speech only at punctuation already in the accepted text.
function blocks(text) {
  const sentences = text.match(/[^。！？!?]+[。！？!?]*[」』]?/gu) ?? [];
  return sentences.flatMap(function split(sentence) {
    if (characterCount(sentence) <= 56) return [sentence];
    const chars = [...sentence];
    const candidates = chars
      .map((char, index) => (/[、，]/u.test(char) ? index + 1 : -1))
      .filter((index) => index >= 18 && index <= 50);
    if (!candidates.length) {
      const fallback = chars
        .map((char, index) => (/[のがをにはで]/u.test(char) ? index + 1 : -1))
        .filter((index) => index >= 24 && index <= 44);
      if (!fallback.length) throw new Error(`Manual caption boundary required: ${sentence}`);
      candidates.push(...fallback);
    }
    const target = Math.min(38, Math.round(chars.length / 2));
    const cut = candidates.reduce((a, b) =>
      Math.abs(a - target) < Math.abs(b - target) ? a : b,
    );
    return [
      ...split(chars.slice(0, cut).join("")),
      ...split(chars.slice(cut).join("")),
    ];
  });
}

function displayText(text) {
  const chars = [...text];
  if (chars.length <= 35) return text;
  const valid = (index) => index >= chars.length - 35 && index <= 35;
  const punctuation = chars
    .map((char, index) => (/[、，。！？!?]/u.test(char) ? index + 1 : -1))
    .filter(valid);
  const particles = chars
    .map((char, index) => (/[のがをにはでと]/u.test(char) ? index + 1 : -1))
    .filter(valid);
  const candidates = punctuation.length ? punctuation : particles;
  const target = Math.round(chars.length / 2);
  if (!candidates.length) return `${chars.slice(0, target).join("")}\n${chars.slice(target).join("")}`;
  const cut = candidates.reduce((a, b) =>
    Math.abs(a - target) < Math.abs(b - target) ? a : b,
  );
  return `${chars.slice(0, cut).join("")}\n${chars.slice(cut).join("")}`;
}

for (const segment of sourceTimeline.segments) {
  const number = Number(segment.id);
  const id = segment.id;
  const audioPath = `public/episode5/${number}.mp3`;
  const alignmentPath = `docs/episode5/alignment-${id}.json`;
  const textPath = `docs/episode5/spoken-text-${id}.txt`;
  const sttPath = `docs/episode5/stt-${id}.json`;
  const alignment = read(alignmentPath);
  const meta = read(`${alignmentPath}.meta.json`);
  const text = fs.readFileSync(textPath, "utf8").replace(/[\r\n]/g, "");
  const allCharacters = alignment.characters.filter(
    (character) => !/^[\r\n]+$/.test(character.text),
  );
  if (allCharacters.slice(0, 3).map((character) => character.text).join("") !== "はい。" ||
      allCharacters.slice(-3).map((character) => character.text).join("") !== "はい。") {
    throw new Error(`Recording cues differ: ${id}`);
  }
  const characters = allCharacters.slice(3, -3);
  const bodyText = text.replace(/^はい。/u, "").replace(/はい。$/u, "");
  const lexical = characters.filter((character) =>
    /[\p{L}\p{N}]/u.test(character.text),
  );
  const grouped = new Map();
  for (const character of lexical) {
    grouped.set(character.start, (grouped.get(character.start) ?? 0) + 1);
  }
  const bins = Array.from({length: 10}, (_, bin) =>
    lexical.filter(
      (character) =>
        Math.min(
          9,
          Math.floor(
            (character.start / segment.audioDurationSeconds) * 10,
          ),
        ) === bin,
    ).length,
  );
  const invalid = characters.filter(
    (character) =>
      !Number.isFinite(character.start) ||
      !Number.isFinite(character.end) ||
      character.start < 0 ||
      character.end < character.start ||
      character.end > segment.audioDurationSeconds,
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
    fullTextMatches:
      allCharacters.map((character) => character.text).join("") === text &&
      characters.map((character) => character.text).join("") === bodyText,
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
      allCharacters.at(-1).end - sttWords.at(-1).end,
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

  let cursor = 0;
  for (const textBlock of blocks(bodyText)) {
    const size = characterCount(textBlock);
    const slice = characters.slice(cursor, cursor + size);
    if (slice.map((character) => character.text).join("") !== textBlock) {
      throw new Error(`Character mapping mismatch in ${id}: ${textBlock}`);
    }
    const segmentStartMs = (segment.from / fps) * 1000;
    const startMs = segmentStartMs + (slice[0].start - segment.audioStartSeconds) * 1000;
    const endMs = segmentStartMs + (slice.at(-1).end - segment.audioStartSeconds) * 1000;
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
      startMs: Math.max(segmentStartMs, startMs - 300),
    });
    spokenTiming.push({
      audio: id,
      text: textBlock,
      localStart: slice[0].start - segment.audioStartSeconds,
      localEnd: slice.at(-1).end - segment.audioStartSeconds,
      start: startMs / 1000,
      end: endMs / 1000,
    });
    cursor += size;
  }
  if (cursor !== characters.length) {
    throw new Error(`Incomplete text coverage in ${id}`);
  }
}

const write = (file, data) =>
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
write("docs/episode5/alignment-verification.json", {
  checks,
  scope:
    "Exact accepted text, cache integrity, timing distribution and independent STT endpoint comparison; not human listening approval.",
});
write("docs/episode5/captions-unshifted.json", rawCaptions);
write("docs/episode5/spoken-timing.json", spokenTiming);
write("src/episode5/captions.json", captions);
write("src/episode5/timeline.json", {
  fps,
  width,
  height,
  durationInFrames: sourceTimeline.durationInFrames,
  interClipGapFrames,
  segments: sourceTimeline.segments,
});

console.log(
  JSON.stringify({
    checks,
    captions: captions.length,
    durationInFrames: sourceTimeline.durationInFrames,
    seconds: sourceTimeline.durationInFrames / fps,
    insertedSilenceSeconds:
      ((sourceTimeline.segments.length - 1) * interClipGapFrames) / fps,
  }),
);
