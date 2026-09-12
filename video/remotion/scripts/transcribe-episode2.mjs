import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import 'dotenv/config';

// Episode 2 only: approved audio is the source of truth. No reference script sent.
const endpoint = 'https://api.elevenlabs.io/v1/speech-to-text';
const options = {model_id:'scribe_v2', language_code:'ja', timestamps_granularity:'word', tag_audio_events:'false', diarize:'false'};
const hash = (data) => createHash('sha256').update(data).digest('hex');
const names = ['１.mp3', '２.mp3', '3.mp3', '4.mp3', '5.mp3'];
for (const [index, name] of names.entries()) {
  const id = String(index + 1).padStart(2, '0');
  const audioPath = `public/Episode2/${name}`;
  const output = `docs/episode2/stt-${id}.json`;
  const metaPath = `${output}.meta.json`;
  const audio = await fs.readFile(audioPath);
  try {
    const cached = await fs.readFile(output);
    const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
    if (meta.audioSha256 !== hash(audio) || meta.responseSha256 !== hash(cached) || JSON.stringify(meta.options) !== JSON.stringify(options)) throw new Error(`Cache differs: ${id}`);
    console.log(`Reusing STT ${id}; API calls: 0`);
    continue;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  for (const file of [output, metaPath]) {
    try { await fs.access(file); throw new Error(`Existing file: ${file}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY missing');
  const form = new FormData();
  form.append('file', new Blob([audio], {type:'audio/mpeg'}), name);
  for (const [key, value] of Object.entries(options)) form.append(key, value);
  const response = await fetch(endpoint, {method:'POST', headers:{'xi-api-key':apiKey}, body:form, signal:AbortSignal.timeout(180000)});
  if (!response.ok) throw new Error(`STT ${id}: HTTP ${response.status}; no automatic retry`);
  const raw = await response.text();
  await fs.writeFile(output, raw, {flag:'wx'});
  await fs.writeFile(metaPath, JSON.stringify({audioPath, audioSha256:hash(audio), endpoint, options, createdAt:new Date().toISOString(), responseSha256:hash(raw), apiCalls:1}, null, 2)+'\n', {flag:'wx'});
  const result = JSON.parse(raw);
  console.log(JSON.stringify({id, language:result.language_code, characters:result.text?.length, words:result.words?.length}));
}
