import {createHash} from "node:crypto";
import {createReadStream} from "node:fs";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseMedia} from "@remotion/media-parser";
import {nodeReader} from "@remotion/media-parser/node";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const source = path.join(projectDir, "out", "AI-Radio-Episode5-Main-v01.mp4");
const reportPath = path.join(
  projectDir,
  "docs",
  "episode5",
  "render-verification.json",
);
const expected = {
  durationInSeconds: 15305 / 30,
  fps: 30,
  width: 1280,
  height: 720,
  container: "mp4",
  videoCodec: "h264",
  audioCodec: "aac",
  durationToleranceSeconds: 0.1, // AAC padding may make the MP4 container longer than the exact video track.
};

const info = await parseMedia({
  src: source,
  reader: nodeReader,
  fields: {
    dimensions: true,
    durationInSeconds: true,
    fps: true,
    videoCodec: true,
    audioCodec: true,
    tracks: true,
    size: true,
    container: true,
    sampleRate: true,
    numberOfAudioChannels: true,
  },
  acknowledgeRemotionLicense: true,
});

const sha256 = await new Promise((resolve, reject) => {
  const hash = createHash("sha256");
  const stream = createReadStream(source);
  stream.on("data", (chunk) => hash.update(chunk));
  stream.on("end", () => resolve(hash.digest("hex")));
  stream.on("error", reject);
});

const checks = {
  duration:
    info.durationInSeconds !== null &&
    Math.abs(info.durationInSeconds - expected.durationInSeconds) <= expected.durationToleranceSeconds,
  fps: info.fps === expected.fps,
  dimensions:
    info.dimensions?.width === expected.width &&
    info.dimensions?.height === expected.height,
  container: info.container === expected.container,
  videoCodec: info.videoCodec === expected.videoCodec,
  audioCodec: info.audioCodec === expected.audioCodec,
  audioTrack: info.tracks.some((track) => track.type === "audio"),
  videoTrack: info.tracks.some((track) => track.type === "video"),
  nonEmpty: (info.size ?? 0) > 0,
};

const report = {
  source,
  expected,
  actual: {
    ...info,
    sha256,
  },
  checks,
  passed: Object.values(checks).every(Boolean),
};

await mkdir(path.dirname(reportPath), {recursive: true});
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

if (!report.passed) {
  process.exitCode = 1;
}
