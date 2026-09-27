import fs from "node:fs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const timeline = read("src/episode5/timeline.json");
const captions = read("src/episode5/captions.json");
const checks = timeline.segments.map((segment) => {
  const alignment = read(`docs/episode5/alignment-${segment.id}.json`);
  const characters = alignment.characters.filter((character) => character.text.trim() !== "");
  const openingCue = characters.slice(0, 3);
  const closingCue = characters.slice(-3);
  const body = characters.slice(3, -3);
  const cueText = (cue) => cue.map((character) => character.text).join("");
  return {
    id: segment.id,
    openingCue: cueText(openingCue),
    closingCue: cueText(closingCue),
    cutStart: segment.audioStartSeconds,
    bodyStart: body[0].start,
    bodyEnd: body.at(-1).end,
    cutEnd: segment.audioEndSeconds,
    passed:
      cueText(openingCue) === "はい。" &&
      cueText(closingCue) === "はい。" &&
      openingCue.at(-1).end < segment.audioStartSeconds &&
      segment.audioStartSeconds < body[0].start &&
      body.at(-1).end < segment.audioEndSeconds &&
      segment.audioEndSeconds < closingCue[0].start,
  };
});
const report = {
  checks,
  captions: captions.length,
  cueCaptions: captions.filter((caption) => caption.text.includes("はい。")),
  maxLineCharacters: Math.max(...captions.flatMap((caption) =>
    caption.text.split("\n").map((line) => [...line].length))),
};
report.passed = checks.every((check) => check.passed) &&
  report.cueCaptions.length === 0 && report.maxLineCharacters <= 35;
fs.writeFileSync("docs/episode5/cut-verification.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({passed: report.passed, clips: checks.length, captions: report.captions, maxLineCharacters: report.maxLineCharacters}));
if (!report.passed) process.exitCode = 1;
