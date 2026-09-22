import { readFile, writeFile, mkdir, lstat, realpath, open } from 'node:fs/promises';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { sha256, digest, makeUnits, editingEvidence, labelsTemplate, MODEL, QUESTION_VERSION, questions } from './core.mjs';

export const EXPERIMENT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO = resolve(EXPERIMENT, '../..');
const RUNS = join(EXPERIMENT, 'runs');
const production = 'video/remotion/src/episode4';
const sources = ['captions.json', 'slide-cues.json', 'se-cues.json', 'timeline.json'];

async function realDirectory(path, create = false) {
  if (create) await mkdir(path, { recursive: false }).catch(e => { if (e.code !== 'EEXIST') throw e; });
  const stat = await lstat(path);
  if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Output directories must not be symlinks/junctions');
  return realpath(path);
}

export async function runDirectory(name, create = false) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$/.test(name)) throw new Error('Invalid run name');
  const root = await realDirectory(EXPERIMENT);
  const runs = await realDirectory(RUNS, true);
  if (dirname(runs) !== root) throw new Error('Output escaped experiment directory');
  const path = join(runs, name);
  if (create) await mkdir(path); // No overwrite of previous runs.
  const actual = await realDirectory(path);
  if (dirname(actual) !== runs) throw new Error('Output escaped runs directory');
  return actual;
}

export const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
export async function writeNew(dir, name, content) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(name)) throw new Error('Invalid output filename');
  await writeFile(join(dir, name), typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n', { flag: 'wx' });
}

export async function prepare() {
  const data = {};
  const sourceFiles = [];
  for (const name of sources) {
    const path = `${production}/${name}`;
    const content = await readFile(join(REPO, path));
    sourceFiles.push({ path, sha256: sha256(content) });
    data[name] = JSON.parse(content.toString('utf8'));
  }
  const units = makeUnits(data['captions.json']).map(unit => ({ ...unit,
    editingEvidence: editingEvidence(unit, data['slide-cues.json'], data['se-cues.json'], data['timeline.json'].fps),
  }));
  const dataset = {
    schemaVersion: 1,
    episode: '004',
    sourceKind: 'completed-video-captions',
    segmentation: 'one-existing-caption-meaning-cluster; previous=3; next=1; no-cue-based-splitting',
    fps: data['timeline.json'].fps,
    sourceFiles,
    model: MODEL,
    questionVersion: QUESTION_VERSION,
    questions,
    units,
  };
  dataset.datasetId = digest(dataset);
  const name = new Date().toISOString().replace(/[^0-9TZ]/g, '') + '-' + randomUUID().slice(0, 8);
  const dir = await runDirectory(name, true);
  await writeNew(dir, 'input.json', dataset);
  await writeNew(dir, 'human-labels.json', labelsTemplate(dataset));
  return { name, dir, dataset };
}

export async function loadDataset(dir) {
  const data = await readJson(join(dir, 'input.json'));
  const { datasetId, ...body } = data;
  if (digest(body) !== datasetId) throw new Error('Input snapshot was modified; prepare a new run');
  if (digest(data.questions) !== digest(questions) || data.questionVersion !== QUESTION_VERSION || data.model !== MODEL) {
    throw new Error('Questions/model changed; prepare a new run');
  }
  return data;
}

export async function verifySources(dataset) {
  for (const source of dataset.sourceFiles) {
    const path = resolve(REPO, source.path);
    const rel = relative(REPO, path);
    if (isAbsolute(rel) || rel.startsWith('..')) throw new Error('Invalid source path');
    if (sha256(await readFile(path)) !== source.sha256) throw new Error('Production source changed since prepare');
  }
}

// Exclusive creation also prevents rerunning a partially completed, billable run.
export const createJournal = dir => open(join(dir, 'evaluation.jsonl'), 'wx');
