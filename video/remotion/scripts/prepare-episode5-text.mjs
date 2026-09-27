import fs from "node:fs/promises";

const replacements = [
  [/ディープシーク/g, "DeepSeek"],
  [/DeepSeekV3/g, "DeepSeek-V3"],
  [/DeepSeekR1/g, "DeepSeek-R1"],
  [/約六百万ドル/g, "約600万ドル"],
  [/約五百六十万ドル/g, "約560万ドル"],
  [/八から九億円/g, "8〜9億円"],
  [/二千四十八機/g, "2048基"],
  [/GPT4O/g, "GPT-4o"],
  [/Claude三点五、Sonnet/g, "Claude 3.5 Sonnet"],
  [/Mixture-of-Experts/g, "Mixture of Experts"],
];

for (let number = 1; number <= 7; number += 1) {
  const id = String(number).padStart(2, "0");
  const stt = JSON.parse(await fs.readFile(`docs/episode5/stt-${id}.json`, "utf8"));
  let text = stt.text.trim();
  for (const [search, replacement] of replacements) text = text.replace(search, replacement);
  if (!text.startsWith("はい。") || !text.endsWith("はい。")) {
    throw new Error(`Review audio boundaries before preparing text ${id}`);
  }
  await fs.writeFile(`docs/episode5/spoken-text-${id}.txt`, `${text}\n`, {flag: "wx"});
  console.log(JSON.stringify({id, characters: [...text].length, start: text.slice(0, 42), end: text.slice(-42)}));
}
