import {mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import {enableTailwind} from "@remotion/tailwind-v4";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const outputDir = path.join(projectDir, "out", "review", "episode4");
const compositionId = "AI-Radio-Episode4-Main-v01";

const reviewPoints = [
  {label: "intro", seconds: 20},
  {label: "before-cat", seconds: 60.3},
  {label: "cat-entrance", seconds: 61},
  {label: "world", seconds: 110},
  {label: "core", seconds: 140},
  {label: "compute-kitchen", seconds: 220},
  {label: "fab", seconds: 270},
  {label: "shortage", seconds: 350},
  {label: "locations", seconds: 430},
  {label: "resilience", seconds: 510},
  {label: "capability-physical", seconds: 610},
  {label: "summary", seconds: 645},
  {label: "closing-with-cat", seconds: 700},
  {label: "closing-after-cat", seconds: 730},
];

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

const composition = await selectComposition({
  serveUrl,
  id: compositionId,
});

for (const point of reviewPoints) {
  const frame = Math.round(point.seconds * composition.fps);
  const output = path.join(
    outputDir,
    `${String(frame).padStart(5, "0")}-${point.label}.png`,
  );

  await renderStill({
    serveUrl,
    composition,
    frame,
    output,
    imageFormat: "png",
    overwrite: true,
  });

  console.log(`${point.label}\t${point.seconds.toFixed(1)}s\t${frame}\t${output}`);
}
