import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { questions, makeUnits, stateFor, editingEvidence, sampleIndices, normalize, labelsTemplate, compare, markdownReport, csvReport } from '../src/core.mjs';
import { runEvaluations, safeError } from '../src/runner.mjs';
import { createEvaluator } from '../src/provider.ts';
import { runDirectory, EXPERIMENT, REPO } from '../src/storage.mjs';

// Synthetic contract fixture; never presented as a Jev observation.
const fixture = () => ({
  answers: Object.fromEntries(Object.entries(questions).map(([key, q]) => {
    const options = Object.keys(q.criteria);
    return [key, { type: 'choice', choice: options[0], probabilities: Object.fromEntries(options.map((option, i) => [option, i === 0 ? 1 : 0])) }];
  })),
  usage: { inputTokens: 100, outputTokens: 10 },
  providerMetadata: {
    typesafe: { confidence: { visualAid: 0.8, sectionChange: 0.9, attentionReset: 0.7 } },
    gateway: { cost: '0', marketCost: '0.0000042', gatewayCost: '0', surchargeCost: '0', ignoredSecret: 'DO_NOT_SAVE' },
  },
});
const captions = [
  { text: '最初の話。', startMs: 0, endMs: 1000 },
  { text: '次の話。', startMs: 1200, endMs: 2300 },
  { text: '三つ目。', startMs: 2400, endMs: 3300 },
  { text: '四つ目。', startMs: 3400, endMs: 4300 },
  { text: '五つ目。', startMs: 4400, endMs: 5300 },
];
const units = makeUnits(captions).map(u => ({ ...u, editingEvidence: { slides: [], nearbySoundCues: [] } }));
const dataset = { datasetId: 'fixture', units };

test('completed episode preserves all 182 texts and times, with no production writes', async () => {
  const source = await readFile(join(REPO, 'video/remotion/src/episode4/captions.json'), 'utf8');
  const parsed = JSON.parse(source);
  const result = makeUnits(parsed);
  assert.equal(result.length, 182);
  assert.deepEqual(result.map(({ text, startMs, endMs }) => ({ text, startMs, endMs })),
    parsed.map(({ text, startMs, endMs }) => ({ text, startMs, endMs })));
  assert.equal(new Set(result.map(u => u.id)).size, 182);
});

test('malformed/unordered captions fail; intentional overlap is preserved', () => {
  assert.throws(() => makeUnits([]));
  assert.throws(() => makeUnits([{ ...captions[0], text: '' }]));
  assert.throws(() => makeUnits([captions[1], captions[0]]));
  assert.throws(() => makeUnits([{ ...captions[0], endMs: 0 }]));
  assert.equal(makeUnits([captions[0], { ...captions[1], startMs: 900 }])[1].startMs, 900);
});

test('context uses original neighbors including outside sample; no edit-label leakage', () => {
  const state = stateFor(units, 3);
  assert.deepEqual(state.previous, captions.slice(0, 3).map(({ text }) => ({ text })));
  assert.equal(state.target.text, captions[3].text);
  assert.equal(state.next[0].text, captions[4].text);
  assert.equal(stateFor(units, 0).previous.length, 0);
  assert.equal(stateFor(units, 4).next.length, 0);
  assert(!JSON.stringify(state).includes('editingEvidence'));
  assert.deepEqual(Object.keys(state.target), ['text']);
});

test('cue overlaps and FPS conversion are evidence only, with a 1 second SE margin', () => {
  const evidence = editingEvidence(units[1], [
    { id: 'before', enabled: true, startSeconds: 0, endSeconds: 1.2 },
    { id: 'overlap', enabled: true, startSeconds: 1.1, endSeconds: 3 },
    { id: 'disabled', enabled: false, startSeconds: 1, endSeconds: 3 },
  ], [{ id: 'cue', from: 35 }, { id: 'far', from: 200 }], 30);
  assert.deepEqual(evidence.slides.map(s => s.id), ['overlap']);
  assert.equal(evidence.nearbySoundCues[0].startMs, 35 / 30 * 1000);
  assert.equal(evidence.nearbySoundCues.length, 1);
  assert(!('visualAid' in evidence));
});

test('bounded sample spans whole episode without duplicate calls', () => {
  const selected = sampleIndices(182, 12);
  assert.equal(selected[0], 0);
  assert.equal(selected.at(-1), 181);
  assert.equal(new Set(selected).size, 12);
  for (const invalid of [0, -1, 1.1, NaN, 183]) assert.throws(() => sampleIndices(182, invalid));
});

test('confidence is provider statistic, not chosen probability; missing stays null', () => {
  const result = fixture();
  const normalized = normalize(result);
  assert.equal(normalized.visualAid.selectedProbability, 1);
  assert.equal(normalized.visualAid.confidence, 0.8);
  assert.equal(normalized.sectionChange.value, true);
  delete result.providerMetadata;
  assert.equal(normalize(result).visualAid.confidence, null);
});

test('bad classification, probabilities and confidence are rejected', () => {
  let result = fixture();
  result.answers.visualAid.choice = 'WRITE_A_SCRIPT';
  assert.throws(() => normalize(result));
  result = fixture();
  result.answers.visualAid.probabilities.NONE = 2;
  assert.throws(() => normalize(result));
  result = fixture();
  result.providerMetadata.typesafe.confidence.visualAid = -1;
  assert.throws(() => normalize(result));
});

test('actual AI SDK Gateway adapter accepts documented response and sends three choices', async () => {
  let calls = 0;
  const evaluate = createEvaluator('synthetic-test-key', async (url, init) => {
    calls++;
    assert(String(url).endsWith('/evaluation-model'));
    const body = JSON.parse(init.body);
    assert.deepEqual(body.questions, questions);
    assert.deepEqual(body.state, stateFor(units, 1));
    assert.deepEqual(body.providerOptions, {});
    return new Response(JSON.stringify(fixture()), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const result = await evaluate(stateFor(units, 1));
  assert.equal(normalize(result).visualAid.confidence, 0.8);
  assert.equal(result.usage.totalTokens, 110);
  assert.equal(calls, 1);
});

test('missing key fails before request and API failures have zero retries', async () => {
  assert.throws(() => createEvaluator(''), /AI_GATEWAY_API_KEY/);
  let calls = 0;
  const evaluate = createEvaluator('synthetic-test-key', async () => {
    calls++;
    return new Response(JSON.stringify({ error: { message: 'rate limited' } }), { status: 429 });
  });
  await assert.rejects(() => evaluate(stateFor(units, 0)));
  assert.equal(calls, 1);
});

test('journal retains request, failure is sanitized, subsequent calls stop', async () => {
  const journal = [];
  let calls = 0;
  const records = await runEvaluations(dataset, [0, 1, 2], async () => {
    if (++calls === 2) throw Object.assign(new Error('SECRET_KEY'), { statusCode: 401 });
    return fixture();
  }, async row => journal.push(row));
  assert.deepEqual(records.map(r => r.status), ['ok', 'error', 'skipped']);
  assert.equal(journal[0].event, 'request');
  assert.equal(calls, 2);
  assert.equal(records[1].error.code, 'AUTH');
  assert(!JSON.stringify(journal).includes('SECRET_KEY'));
  assert.equal(safeError({ name: 'TimeoutError' }).code, 'TIMEOUT');
  assert.equal(safeError({ statusCode: 403 }).code, 'FORBIDDEN');
  assert.deepEqual(journal[0].request.providerOptions, {});
  assert.equal(records[0].response.costs.cost, '0');
  assert.equal(records[0].response.costs.marketCost, '0.0000042');
  assert(!JSON.stringify(journal).includes('DO_NOT_SAVE'));
});

test('comparison reports include full distributions, confidence, latency, usage and separate costs', async () => {
  const records = await runEvaluations(dataset, [0], async () => fixture(), async () => {});
  const comparison = compare(dataset, records, labelsTemplate(dataset));
  const markdown = markdownReport(comparison);
  assert.match(markdown, /NONE: 100%/);
  assert.match(markdown, /COMPARISON: 0%/);
  assert.match(markdown, /YES: 100%/);
  assert.match(markdown, /0\.8/);
  assert.match(markdown, /0\.0000042/);
  const csv = csvReport(comparison);
  assert.match(csv, /p_visual_COMPARISON/);
  assert.match(csv, /confidence_attentionReset/);
  assert.match(csv, /marketCost_usd/);
  assert.equal(csv.trim().split('\n').length, 2);
  delete records[0].response.costs;
  assert.match(markdownReport(compare(dataset, records, labelsTemplate(dataset))), /未取得/);
});

test('unlabeled does not mean NO; labeled disagreement and zero labels counted correctly', () => {
  const labels = labelsTemplate(dataset);
  const record = { id: units[0].id, status: 'ok', decisions: normalize(fixture()) };
  assert.equal(compare(dataset, [record], labels).scores.visualAid.agreement, null);
  labels.units[0].visualAid = 'NONE';
  labels.units[0].sectionChange = false;
  const result = compare(dataset, [record], labels);
  assert.equal(result.scores.visualAid.agreement, 1);
  assert.equal(result.scores.sectionChange.agreement, 0);
  assert.equal(result.scores.attentionReset.labeled, 0);
  assert.throws(() => compare(dataset, [record], { ...labels, datasetId: 'other' }));
  labels.units.push(labels.units[0]);
  assert.throws(() => compare(dataset, [record], labels));
});

test('path traversal is rejected; CLI does not allow arbitrary output paths', async () => {
  for (const bad of ['../video', 'C:\\production', '/tmp', '.', '..', 'a/b']) {
    await assert.rejects(() => runDirectory(bad), /Invalid run name/);
  }
  const result = spawnSync(process.execPath, ['src/cli.mjs', 'evaluate', '--output', '../../video'], { cwd: EXPERIMENT, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown option/);
});
