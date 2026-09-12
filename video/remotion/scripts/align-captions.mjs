import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import 'dotenv/config';

const args = process.argv.slice(2);
if (args.length !== 3) throw new Error('Usage: node scripts/align-captions.mjs <audio> <accepted-text> <output.json>');
const [audioPath, textPath, outputPath] = args;
const audio = await fs.readFile(audioPath);
const transcript = await fs.readFile(textPath, 'utf8');
const hash = (data) => createHash('sha256').update(data).digest('hex');
const inputs = {audioSha256: hash(audio), textSha256: hash(transcript), endpoint: 'https://api.elevenlabs.io/v1/forced-alignment'};
const metaPath = `${outputPath}.meta.json`;
try {
  const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
  const cached = await fs.readFile(outputPath);
  if (Object.entries(inputs).every(([k,v]) => meta[k] === v) && meta.responseSha256 === hash(cached)) {
    console.log('Matching cached alignment reused; API calls: 0');
    process.exit(0);
  }
  throw new Error('Existing cache differs; choose a new output path.');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
// Never overwrite an existing response, even if its metadata is missing.
try { await fs.access(outputPath); throw new Error('Output exists; choose a new path.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error('ELEVENLABS_API_KEY is missing');
await fs.mkdir(path.dirname(outputPath), {recursive:true});
const form = new FormData();
form.append('file', new Blob([audio], {type:'audio/mpeg'}), path.basename(audioPath));
form.append('text', transcript);
const started = Date.now();
const response = await fetch(inputs.endpoint, {method:'POST', headers:{'xi-api-key':apiKey}, body:form, signal:AbortSignal.timeout(180000)});
if (!response.ok) {
  const error = await response.json().catch(() => ({}));
  const detail = error.detail;
  const safeDetail = JSON.stringify({status: detail?.status, message: detail?.message}).replaceAll(apiKey, '[REDACTED]').slice(0, 600);
  throw new Error(`Forced Alignment HTTP ${response.status}; ${safeDetail}; no automatic retry`);
}
const alignment = await response.json();
const serialized = JSON.stringify(alignment, null, 2) + '\n';
await fs.writeFile(outputPath, serialized, {flag:'wx'});
await fs.writeFile(metaPath, JSON.stringify({...inputs, audioPath, textPath, createdAt:new Date().toISOString(), elapsedMs:Date.now()-started, apiCalls:1, responseSha256:hash(serialized)}, null, 2)+'\n', {flag:'wx'});
console.log(JSON.stringify({saved:outputPath, characters:alignment.characters?.length, words:alignment.words?.length, loss:alignment.loss, elapsedMs:Date.now()-started}));
