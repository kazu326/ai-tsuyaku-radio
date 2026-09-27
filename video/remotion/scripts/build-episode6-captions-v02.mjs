import fs from "node:fs";

const timeline = JSON.parse(fs.readFileSync("src/episode6/timeline-v02.json", "utf8"));
const captions = [];
const corrected = (text) => text
  .replace(/エピソード(\d{3})/gu, "Episode $1")
  .replace(/ディープシーク/gu, "DeepSeek")
  .replace(/ミストラル/gu, "Mistral")
  .replace(/MistralAI/gu, "Mistral AI")
  .replace(/Mistral3/gu, "Mistral 3")
  .replace(/シーズンワン/gu, "Season 1")
  .replace(/シーズン1/gu, "Season 1")
  .replace(/シーズン2/gu, "Season 2")
  .replace(/ご飯/gu, "ごはん")
  .replace(/導入カスタマイズ/gu, "導入・カスタマイズ");
const size = (items) => [...items.map((item) => item.text).join("")].length;

const displayText = (text) => {
  const chars = [...corrected(text)];
  if (chars.length <= 34) return chars.join("");
  const valid = (boundary) =>
    boundary >= Math.max(12, chars.length - 34) &&
    boundary <= Math.min(34, chars.length - 12);
  const punctuation = chars.flatMap((char, index) =>
    /[、，。！？!?]/u.test(char) && valid(index + 1) ? [index + 1] : []);
  const particles = chars.flatMap((char, index) =>
    /[のがをにはでと]/u.test(char) && valid(index + 1) ? [index + 1] : []);
  const candidates = punctuation.length ? punctuation : particles;
  const center = Math.round(chars.length / 2);
  const cut = candidates.length
    ? candidates.reduce((best, candidate) =>
      Math.abs(candidate - center) < Math.abs(best - center) ? candidate : best)
    : center;
  return `${chars.slice(0, cut).join("")}\n${chars.slice(cut).join("")}`;
};

const splitLong = (items) => {
  if (size(items) <= 50) return [items];
  const candidates = items.slice(1, -1).flatMap((item, index) => {
    const cut = index + 2;
    const left = size(items.slice(0, cut));
    const right = size(items.slice(cut));
    if (left < 18 || left > 48 || right < 15) return [];
    return [{cut, left, natural: /[、，]/u.test(item.text)}];
  });
  if (!candidates.length) {
    throw new Error(`Caption cannot be split: ${items.map((item) => item.text).join("")}`);
  }
  const target = Math.round(size(items) / 2);
  const natural = candidates.filter((candidate) => candidate.natural);
  const pool = natural.length ? natural : candidates;
  const {cut} = pool.reduce((best, candidate) =>
    Math.abs(candidate.left - target) < Math.abs(best.left - target) ? candidate : best);
  return [...splitLong(items.slice(0, cut)), ...splitLong(items.slice(cut))];
};

for (const segment of timeline.segments) {
  const data = JSON.parse(fs.readFileSync(`docs/episode6/${segment.timingSource}`, "utf8"));
  const words = segment.timingSource.startsWith("alignment")
    ? data.characters.filter((item) => item.text.trim() !== "")
    : data.words.filter((item) => item.type === "word").flatMap((word) => {
      const leading = word.text.match(/^([、，。！？!?」』]+)(.+)$/u);
      if (!leading) return [word];
      return [{...word, text: leading[1], end: word.start}, {...word, text: leading[2]}];
    });
  if (words.slice(0, 3).map((word) => word.text).join("") !== "はい。" ||
      words.slice(-3).map((word) => word.text).join("") !== "はい。") {
    throw new Error(`Recording cue differs: ${segment.id}`);
  }
  const sentences = [];
  let group = [];
  for (const word of words.slice(3, -3)) {
    if (/^[」』]$/u.test(word.text) && !group.length && sentences.length) {
      sentences.at(-1).push(word);
      continue;
    }
    group.push(word);
    if (segment.id === "04" &&
        group.map((item) => item.text).join("") === "公開した先にできる「土台」") {
      sentences.push(group);
      group = [];
      continue;
    }
    if (/[。！？!?]$/u.test(word.text)) {
      sentences.push(group);
      group = [];
    }
  }
  if (group.length) sentences.push(group);
  for (const wordsInGroup of sentences.flatMap(splitLong)) {
    const first = wordsInGroup[0];
    const last = wordsInGroup.at(-1);
    const offsetMs = ((segment.from - segment.trimBeforeFrames) / timeline.fps) * 1000;
    const segmentStartMs = (segment.from / timeline.fps) * 1000;
    const segmentEndMs = ((segment.from + segment.durationInFrames) / timeline.fps) * 1000;
    captions.push({
      text: displayText(wordsInGroup.map((word) => word.text).join("")),
      startMs: Math.max(segmentStartMs, offsetMs + first.start * 1000 - 250),
      endMs: Math.min(segmentEndMs, offsetMs + last.end * 1000 + 120),
      timestampMs: null,
      confidence: null,
    });
  }
}

if (captions.some((caption) => caption.text.includes("はい。") || caption.endMs <= caption.startMs)) {
  throw new Error("Invalid caption range or recording cue present");
}
fs.writeFileSync("src/episode6/captions-v02.json", `${JSON.stringify(captions, null, 2)}\n`);
console.log(JSON.stringify({count: captions.length, first: captions[0], last: captions.at(-1)}));
