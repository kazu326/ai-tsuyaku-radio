import {mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import {enableTailwind} from "@remotion/tailwind-v4";
import timeline from "../src/episode6/timeline-v02.json" with {type: "json"};
import visuals from "../src/episode6/visuals-v02.json" with {type: "json"};

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectDir, "out", "review", "episode6-v02");
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
const panel = (id) => visuals.panels.find((item) => item.id === id);
const points = [
  ["shortstory", panel("cat-sample").from + 45],
  ["chapter1", panel("deepseek-release").from + 60],
  ["chapter2", panel("api-operation").from + 60],
  ["before-A", visuals.canvas[0].from - 15],
  ["A", visuals.canvas[0].from + 30],
  ["after-A", visuals.canvas[0].from + visuals.canvas[0].durationInFrames + 15],
  ["before-B", visuals.canvas[1].from - 15],
  ["B", visuals.canvas[1].from + 30],
  ["after-B", visuals.canvas[1].from + visuals.canvas[1].durationInFrames + 15],
  ["revenue", panel("revenue-paths").from + 60],
  ["summary", panel("season-recap").from + 60],
];
if (composition.durationInFrames !== timeline.durationInFrames) throw new Error("Timeline mismatch");
console.log(JSON.stringify({width: composition.width, height: composition.height, fps: composition.fps, durationInFrames: composition.durationInFrames}));
for (const [label, frame] of points) {
  const output = path.join(outputDir, `${String(frame).padStart(5, "0")}-${label}.png`);
  await renderStill({serveUrl, composition, frame, output, imageFormat: "png", overwrite: true});
  console.log(`${label}\t${(frame / timeline.fps).toFixed(2)}s\t${output}`);
}
