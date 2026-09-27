import fs from "node:fs";

const timeline = JSON.parse(fs.readFileSync("src/episode6/timeline.json", "utf8"));
const captions = [];
const cue = "はい。";

const corrected = (text) => text
  .replace(/エピソード(\d{3})/gu, "Episode $1")
  .replace(/ディープシーク/gu, "DeepSeek")
  .replace(/ミストラル/gu, "Mistral");

const displayText = (text) => {
  const chars = [...corrected(text)];
  if (chars.length <= 34) return chars.join("");
  const candidates = chars.flatMap((char, index) =>
    /[、，。！？!?のがをにはでと]/u.test(char) && index >= 18 && index <= chars.length - 18
      ? [index + 1]
      : []);
  const center = Math.round(chars.length / 2);
  const cut = candidates.length
    ? candidates.reduce((best, candidate) => Math.abs(candidate - center) < Math.abs(best - center) ? candidate : best)
    : center;
  return `${chars.slice(0, cut).join("")}\n${chars.slice(cut).join("")}`;
};

for (const segment of timeline.segments) {
  const stt = JSON.parse(fs.readFileSync(`docs/episode6/stt-${segment.id}.json`, "utf8"));
  const words = stt.words.filter((word) => word.type === "word").flatMap((word) => {
    const leading = word.text.match(/^([。！？!?]+)(.+)$/u);
    if (!leading) return [word];
    return [
      {...word, text: leading[1], end: word.start},
      {...word, text: leading[2]},
    ];
  });
  if (words.slice(0, 3).map((word) => word.text).join("") !== cue ||
      words.slice(-3).map((word) => word.text).join("") !== cue) {
    throw new Error(`Recording cue differs: ${segment.id}`);
  }
  const body = words.slice(3, -3);
  const sentences = [];
  let group = [];
  for (const word of body) {
    group.push(word);
    if (/[。！？!?]$/u.test(word.text)) {
      sentences.push(group);
      group = [];
    }
  }
  if (group.length) sentences.push(group);
  const size = (items) => [...items.map((item) => item.text).join("")].length;
  const splitLong = (items) => {
    if (size(items) <= 50) return [items];
    const candidates = items.slice(1, -1).flatMap((item, index) => {
      const cut = index + 1;
      const left = size(items.slice(0, cut));
      const right = size(items.slice(cut));
      if (left < 18 || left > 48 || right < 15) return [];
      return [{cut, left, natural: /[、，]/u.test(item.text)}];
    });
    if (!candidates.length) throw new Error(`Caption sentence cannot be split: ${items.map((item) => item.text).join("")}`);
    const target = Math.round(size(items) / 2);
    const natural = candidates.filter((candidate) => candidate.natural);
    const pool = natural.length ? natural : candidates;
    const {cut} = pool.reduce((best, candidate) =>
      Math.abs(candidate.left - target) < Math.abs(best.left - target) ? candidate : best);
    return [...splitLong(items.slice(0, cut)), ...splitLong(items.slice(cut))];
  };
  const groups = sentences.flatMap(splitLong);
  for (const wordsInGroup of groups) {
    const first = wordsInGroup[0];
    const last = wordsInGroup.at(-1);
    const offsetMs = (segment.from / timeline.fps) * 1000;
    captions.push({
      text: displayText(wordsInGroup.map((word) => word.text).join("")),
      startMs: Math.max(offsetMs, offsetMs + first.start * 1000 - 250),
      endMs: offsetMs + last.end * 1000 + 120,
      timestampMs: null,
      confidence: null,
    });
  }
}

fs.writeFileSync("src/episode6/captions.json", `${JSON.stringify(captions, null, 2)}\n`);
console.log(JSON.stringify({captionCount: captions.length, first: captions[0], last: captions.at(-1)}));
