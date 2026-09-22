import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { prepare, runDirectory, loadDataset, verifySources, writeNew, readJson, createJournal } from './storage.mjs';
import { sampleIndices, compare, markdownReport, csvReport, summarize } from './core.mjs';
import { runEvaluations } from './runner.mjs';

export async function main(args = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: {
    run: { type: 'string' }, limit: { type: 'string' }, ids: { type: 'string' }, live: { type: 'boolean', default: false },
    'interval-ms': { type: 'string' },
  } });
  const [command] = positionals;
  if (positionals.length !== 1 || !['prepare', 'evaluate', 'compare'].includes(command)) {
    throw new Error('Usage: prepare | evaluate --run NAME [--limit 12 | --ids ep004-c001,...] [--live] | compare --run NAME');
  }
  if (command === 'prepare') {
    if (Object.keys(values).some(k => k !== 'live') || values.live) throw new Error('prepare takes no options');
    const { name, dataset } = await prepare();
    console.log(`Prepared ${dataset.units.length} units. RUN=${name}`);
    return;
  }
  if (!values.run) throw new Error('--run is required');
  const dir = await runDirectory(values.run);
  const dataset = await loadDataset(dir);
  if (command === 'compare') {
    if (values.live || values.limit || values.ids || values['interval-ms']) throw new Error('compare accepts only --run');
    const results = await readJson(join(dir, 'results.json'));
    if (results.datasetId !== dataset.datasetId) throw new Error('Results dataset mismatch');
    const labels = await readJson(join(dir, 'human-labels.json'));
    const comparison = compare(dataset, results.records, labels);
    const suffix = Date.now();
    await writeNew(dir, `comparison-${suffix}.json`, comparison);
    await writeNew(dir, `comparison-${suffix}.md`, markdownReport(comparison));
    await writeNew(dir, `comparison-${suffix}.csv`, csvReport(comparison));
    console.log(`Saved comparison-${suffix}.md`);
    return;
  }
  if (values.ids && values.limit) throw new Error('Choose --ids or --limit');
  const intervalMs = Number(values['interval-ms'] ?? 0);
  if (!Number.isInteger(intervalMs) || intervalMs < 0 || intervalMs > 60000) throw new Error('interval-ms must be 0..60000');
  const indices = values.ids ? values.ids.split(',').map(id => dataset.units.findIndex(u => u.id === id))
    : sampleIndices(dataset.units.length, Number(values.limit ?? 12));
  if (!indices.length || indices.some(i => i < 0) || new Set(indices).size !== indices.length) throw new Error('Invalid/duplicate unit IDs');
  await verifySources(dataset);
  if (!values.live) {
    console.log(`DRY RUN: ${indices.length} calls / ${indices.length * 3} questions; no API requests. Use --live to evaluate.`);
    console.log(indices.map(i => dataset.units[i].id).join(', '));
    return;
  }
  const { createEvaluator } = await import('./provider.ts');
  const evaluate = createEvaluator(); // Missing credential must fail before creating output.
  const journal = await createJournal(dir);
  let records;
  try {
    records = await runEvaluations(dataset, indices, evaluate, async record => {
      await journal.write(JSON.stringify(record) + '\n');
      await journal.sync();
    }, (record, done, total) => console.log(`${done}/${total} ${record.id}: ${record.status}`), intervalMs);
  } finally {
    await journal.close();
  }
  const comparison = compare(dataset, records, await readJson(join(dir, 'human-labels.json')));
  await writeNew(dir, 'results.json', { datasetId: dataset.datasetId, records });
  await writeNew(dir, 'comparison.json', comparison);
  await writeNew(dir, 'comparison.md', markdownReport(comparison));
  await writeNew(dir, 'comparison.csv', csvReport(comparison));
  await writeNew(dir, 'summary.json', summarize(comparison));
  await verifySources(dataset);
  const count = records.filter(r => r.status === 'ok').length;
  console.log(`Saved results.json + comparison.md: ${count}/${records.length} successful. Source hashes unchanged.`);
  if (count !== records.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    // CLI errors are local validation messages; provider errors are sanitized inside runner.
    console.error(error.code === 'EEXIST' ? 'Run/output already exists. Prepare a new run.' : error.message);
    process.exitCode = 1;
  });
}
