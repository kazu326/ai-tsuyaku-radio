import {mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import {enableTailwind} from "@remotion/tailwind-v4";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectDir, "out", "review", "episode6");
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
const composition = await selectComposition({serveUrl, id: "AI-Radio-Episode6-Main-v01"});
console.log(JSON.stringify({width: composition.width, height: composition.height, fps: composition.fps, durationInFrames: composition.durationInFrames}));
for (const seconds of [213, 268.1, 294, 324.3]) {
  const frame = Math.round(seconds * composition.fps);
  const output = path.join(outputDir, `${String(frame).padStart(5, "0")}.png`);
  await renderStill({serveUrl, composition, frame, output, imageFormat: "png", overwrite: true});
  console.log(`${seconds}s ${output}`);
}
