import fs from "node:fs";

const sourcePath = "../../episodes/ep004-ai-semiconductor-race/script.md";
const source = fs.readFileSync(sourcePath, "utf8");
const blocks = source
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .filter(
    (line) =>
      !line.startsWith("# Episode") &&
      !line.startsWith("Status:") &&
      !line.startsWith("最終更新："),
  );

const spoken = (line) => {
  const isHeading = /^## \d+\.\s*/.test(line);
  const text = line
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/^## \d+\.\s*/, "")
    .trim();
  return isHeading && !/[。！？!?]$/.test(text) ? `${text}。` : text;
};

const isDirectionOnly = (line) => /^\[[^\]]+\]$/.test(line);
const slice = (start, end) =>
  blocks
    .slice(start - 1, end)
    .filter((line) => !isDirectionOnly(line))
    .map(spoken)
    .join("");

const introLines = [
  "[casual, slightly distracted]",
  "今日の朝。",
  "うちの周りをパトロール……",
  "あ。",
  "散歩していたら、",
  "畑の前を通ったんですよね！。",
  "土を、",
  "人がずっと掘り返していて。",
  "[thoughtful]",
  "ここ、",
  "そのうち野菜が育つ畑になるんだろうなって。",
  "少し面白いですよね。",
  "ただの土地が、",
  "時間をかけて、",
  "何かを生み出す場所に変わっていく。",
  "[short pause]",
  "で、その時ふと思ったんです。",
  "今、世界中で増えようとしている",
  "半導体工場も、",
  "ちょっと似ているなって。",
  "もちろん、",
  "半導体は土から生えてくるわけじゃないんですけど。",
  "[slightly amused]",
  "アメリカも。",
  "日本も。",
  "ヨーロッパも。",
  "「どうか、うちの国に工場を作ってください」",
  "って、",
  "ものすごく頑張って呼んでいる。",
  "[thoughtful]",
  "畑なら分かるんです。",
  "作物ができるから。",
  "でも半導体工場って、",
  "どうしてそこまで取り合いになるんだろう。",
];
const intro = introLines
  .filter((line) => !isDirectionOnly(line))
  .map(spoken)
  .join("");

// Audio 01 is a human-added cold open. Audio 02-19 cover the current script.
// Direction tags affect delivery but are not part of the spoken transcript.
const texts = [
  intro,
  slice(1, 11),
  slice(12, 22),
  slice(23, 30),
  slice(31, 40),
  slice(41, 51),
  slice(52, 65),
  slice(66, 70),
  slice(71, 79),
  slice(80, 86),
  slice(87, 95),
  slice(96, 108),
  slice(109, 114),
  slice(115, 123),
  slice(124, 135),
  slice(136, 147),
  slice(148, 157),
  `まとめです。${slice(159, 168)}`,
  slice(169, 185),
];

if (texts.length !== 19 || texts.some((text) => text.length < 35)) {
  throw new Error("Episode 4 spoken-text split is incomplete");
}

fs.mkdirSync("docs/episode4", {recursive: true});
texts.forEach((text, index) => {
  if (process.argv.includes("--first-five") && index >= 5) return;
  const id = String(index + 1).padStart(2, "0");
  fs.writeFileSync(`docs/episode4/spoken-text-${id}.txt`, `${text}\n`);
});

console.log(
  JSON.stringify({
    sourcePath,
    chunks: texts.map((text, index) => ({
      id: String(index + 1).padStart(2, "0"),
      characters: [...text].length,
      start: text.slice(0, 26),
      end: text.slice(-26),
    })),
  }),
);
