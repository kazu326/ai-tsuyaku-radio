import {mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";
import {enableTailwind} from "@remotion/tailwind-v4";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectDir, "out");
await mkdir(outputDir, {recursive: true});
const serveUrl = await bundle({
  entryPoint: path.join(projectDir, "src", "index.ts"),
  rootDir: projectDir,
  rspack: true,
  rspackOverride: enableTailwind,
  webpackOverride: enableTailwind,
  onProgress: () => undefined,
  onPublicDirCopyProgress: () => undefined,
});
const composition = await selectComposition({serveUrl, id: "AI-Radio-Episode6-Main-v02"});
const outputLocation = path.join(outputDir, "AI-Radio-Episode6-Main-v02.mp4");
let reported = -1;
await renderMedia({
  serveUrl,
  composition,
  codec: "h264",
  audioCodec: "aac",
  outputLocation,
  concurrency: 3,
  crf: 18,
  overwrite: true,
  onProgress: ({progress}) => {
    const percent = Math.floor(progress * 20) * 5;
    if (percent > reported) {
      reported = percent;
      console.log(`${percent}%`);
    }
  },
});
console.log(outputLocation);
