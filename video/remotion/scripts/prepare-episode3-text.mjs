import fs from "node:fs";

const sourcePath = "../../episodes/ep003-japan-semiconductor/script.md";
const source = fs.readFileSync(sourcePath, "utf8");
const blocks = source
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((line) => !line.startsWith("# Episode") && !line.startsWith("最終確認："));

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

const texts = [
  slice(2, 7),
  slice(8, 14),
  slice(15, 24),
  slice(25, 34),
  slice(35, 46),
  slice(47, 62),
  slice(63, 81),
  slice(82, 97),
  slice(98, 108),
  slice(109, 124),
  slice(125, 143),
  `まとめ。${slice(145, 164)}`,
];

if (texts.length !== 12 || texts.some((text) => text.length < 80)) {
  throw new Error("Episode 3 spoken-text split is incomplete");
}

fs.mkdirSync("docs/episode3", { recursive: true });
texts.forEach((text, index) => {
  const id = String(index + 1).padStart(2, "0");
  fs.writeFileSync(`docs/episode3/spoken-text-${id}.txt`, `${text}\n`);
});

console.log(
  JSON.stringify({
    sourcePath,
    chunks: texts.map((text, index) => ({
      id: String(index + 1).padStart(2, "0"),
      characters: [...text].length,
      start: text.slice(0, 22),
      end: text.slice(-22),
    })),
  }),
);
