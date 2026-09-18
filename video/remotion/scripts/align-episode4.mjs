import {spawn} from "node:child_process";

// Run the cache-safe generic aligner sequentially so a failure cannot fan out
// into repeated API calls. Corrected audio 01-05 use v02 output paths, keeping
// the rejected v01 responses intact for audit. Audio 06-19 remain unchanged.
const correctedFirstFive = process.argv.includes("--corrected-first-five");
const numbers = correctedFirstFive
  ? [1, 2, 3, 4, 5]
  : Array.from({length: 19}, (_, index) => index + 1);

for (const number of numbers) {
  const id = String(number).padStart(2, "0");
  const output =
    number <= 5
      ? `docs/episode4/alignment-v02-${id}.json`
      : `docs/episode4/alignment-${id}.json`;
  const args = [
    "scripts/align-captions.mjs",
    `public/episode4/${number}.mp3`,
    `docs/episode4/spoken-text-${id}.txt`,
    output,
  ];

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {stdio: "inherit"});
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `Alignment ${id} failed (${signal ? `signal ${signal}` : `exit ${code}`})`,
        ),
      );
    });
  });
}
