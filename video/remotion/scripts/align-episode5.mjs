import {spawn} from "node:child_process";

for (let number = 1; number <= 7; number += 1) {
  const id = String(number).padStart(2, "0");
  const args = [
    "scripts/align-captions.mjs",
    `public/episode5/${number}.mp3`,
    `docs/episode5/spoken-text-${id}.txt`,
    `docs/episode5/alignment-${id}.json`,
  ];
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {stdio: "inherit"});
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Alignment ${id} failed (${signal ? `signal ${signal}` : `exit ${code}`})`));
    });
  });
}
