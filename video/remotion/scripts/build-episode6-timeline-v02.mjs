import fs from "node:fs";
import {createHash} from "node:crypto";

const fps = 30;
const sourcePrefix = "episode6/";
const definitions = [
  {id: "shortstory", audio: "shortstory.mp3", timing: "stt-shortstory.json"},
  {id: "01", audio: "1.mp3", timing: "stt-01.json"},
  {id: "02", audio: "2.mp3", timing: "stt-02.json"},
  {id: "03", audio: "3.mp3", timing: "alignment-03.json"},
  {id: "04", audio: "4.mp3", timing: "alignment-04.json"},
  {id: "05", audio: "5.mp3", timing: "stt-05.json"},
];
const hash = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const roundFrame = (seconds) => Math.round(seconds * fps);
const sourceTimings = new Map();
const segments = [];
let from = 0;

for (const definition of definitions) {
  const timingPath = `docs/episode6/${definition.timing}`;
  const timing = JSON.parse(fs.readFileSync(timingPath, "utf8"));
  const characters = definition.timing.startsWith("alignment")
    ? timing.characters.filter((item) => item.text.trim() !== "")
    : timing.words.filter((item) => item.type === "word");
  const opening = characters.slice(0, 3);
  const closing = characters.slice(-3);
  const body = characters.slice(3, -3);
  if (opening.map((item) => item.text).join("") !== "はい。" ||
      closing.map((item) => item.text).join("") !== "はい。" || !body.length) {
    throw new Error(`Recording cues differ: ${definition.id}`);
  }
  const bodyFirst = body[0].start;
  const bodyLast = body.at(-1).end;
  const cutStartSeconds = Math.round((bodyFirst - 0.06) * 100) / 100;
  const cutEndSeconds = Math.round((bodyLast + 0.12) * 100) / 100;
  if (!(opening.at(-1).end < cutStartSeconds && cutStartSeconds < bodyFirst &&
        bodyLast < cutEndSeconds && cutEndSeconds < closing[0].start)) {
    throw new Error(`Invalid cue cut: ${definition.id}`);
  }
  const trimBeforeFrames = roundFrame(cutStartSeconds);
  const trimAfterFrames = roundFrame(cutEndSeconds);
  const durationInFrames = trimAfterFrames - trimBeforeFrames;
  const audio = `${sourcePrefix}${definition.audio}`;
  const audioPath = `public/${audio}`;
  const segment = {
    id: definition.id,
    audio,
    from,
    durationInFrames,
    trimBeforeFrames,
    trimAfterFrames,
    cutStartSeconds,
    cutEndSeconds,
    bodyStartSeconds: bodyFirst,
    bodyEndSeconds: bodyLast,
    openingCueEndSeconds: opening.at(-1).end,
    closingCueStartSeconds: closing[0].start,
    sourceSha256: hash(audioPath),
    timingSource: definition.timing,
  };
  segments.push(segment);
  sourceTimings.set(definition.id, {characters, segment});
  from += durationInFrames;
}

const locatePhrase = (id, phrase) => {
  const {characters, segment} = sourceTimings.get(id);
  const joined = characters.map((item) => item.text).join("");
  const index = joined.indexOf(phrase);
  if (index < 0 || joined.indexOf(phrase, index + 1) >= 0) {
    throw new Error(`Missing or ambiguous anchor in ${id}: ${phrase}`);
  }
  let cursor = 0;
  const anchor = characters.find((item) => {
    const contains = index >= cursor && index < cursor + item.text.length;
    cursor += item.text.length;
    return contains;
  });
  if (!anchor) throw new Error(`Anchor timing missing in ${id}: ${phrase}`);
  const sourceSeconds = anchor.start;
  return {
    segmentId: id,
    phrase,
    sourceSeconds,
    frame: segment.from + roundFrame(sourceSeconds) - segment.trimBeforeFrames,
  };
};

const timeline = {
  fps,
  width: 1920,
  height: 1080,
  durationInFrames: from,
  interClipGapFrames: 0,
  segments,
  cues: {
    freeDownload: locatePhrase("shortstory", "無料ダウンロード"),
    freemiumQuestion: locatePhrase("shortstory", "どうせ後から有料"),
    catSample: locatePhrase("shortstory", "私も猫のご飯"),
    openModelAnalogy: locatePhrase("shortstory", "AIモデルの公開も"),
    developerFoundation: locatePhrase("shortstory", "多くの開発者や会社"),
    deepSeekOpens: locatePhrase("01", "そうして作られたV3"),
    whyPublish: locatePhrase("01", "では、なぜAI企業は"),
    paidApi: locatePhrase("02", "その一方で"),
    managedValue: locatePhrase("02", "モデルが無料でも"),
    carAnalogy: locatePhrase("02", "ここは少し車"),
    modelWeights: locatePhrase("03", "重みは、AIが"),
    foundation: locatePhrase("04", "でも、さっきの車"),
    revenuePaths: locatePhrase("04", "答えは、企業によって"),
    openScope: locatePhrase("04", "もちろん、公開といっても"),
    deepSeekExample: locatePhrase("04", "前回のDeepSeekも"),
    seasonRecap: locatePhrase("05", "ここでエピソード001"),
    surroundingSystem: locatePhrase("05", "AIの強さは"),
    userSide: locatePhrase("05", "では、僕たち使う側は"),
    season2: locatePhrase("05", "シーズン2"),
  },
};
fs.writeFileSync("src/episode6/timeline-v02.json", `${JSON.stringify(timeline, null, 2)}\n`);
console.log(JSON.stringify({
  durationInFrames: from,
  durationSeconds: from / fps,
  cuts: segments.map(({id, from, cutStartSeconds, cutEndSeconds, durationInFrames}) =>
    ({id, from, cutStartSeconds, cutEndSeconds, durationInFrames})),
  cues: timeline.cues,
}, null, 2));
