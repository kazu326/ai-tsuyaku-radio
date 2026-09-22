import { createHash } from 'node:crypto';
import { questions, MODEL, QUESTION_VERSION } from './questions.ts';

export { questions, MODEL, QUESTION_VERSION };
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
export const digest = (value) => sha256(JSON.stringify(value));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

export function makeUnits(captions) {
  assert(Array.isArray(captions) && captions.length > 0, 'Empty captions');
  return captions.map((caption, index) => {
    assert(typeof caption.text === 'string' && caption.text.trim(), 'Invalid caption text');
    assert(Number.isFinite(caption.startMs) && Number.isFinite(caption.endMs)
      && caption.startMs >= 0 && caption.endMs > caption.startMs, 'Invalid caption time');
    // Production captions intentionally overlap by a few frames. Preserve timing verbatim.
    assert(index === 0 || caption.startMs >= captions[index - 1].startMs, 'Unordered captions');
    return {
      id: `ep004-c${String(index + 1).padStart(3, '0')}`,
      captionIndex: index,
      text: caption.text,
      startMs: caption.startMs,
      endMs: caption.endMs,
    };
  });
}

// Context deliberately excludes editing cues, chapter labels and human annotations.
export function stateFor(units, index) {
  assert(Number.isInteger(index) && units[index], 'Invalid unit index');
  const textOnly = ({ text }) => ({ text });
  return {
    audience: 'AIに詳しくない日本語話者。AIの難しい話を、わかる言葉に通訳する番組。',
    previous: units.slice(Math.max(0, index - 3), index).map(textOnly),
    target: textOnly(units[index]),
    next: units.slice(index + 1, index + 2).map(textOnly),
  };
}

export function editingEvidence(unit, slides, sounds, fps) {
  assert(Number.isFinite(fps) && fps > 0, 'Invalid FPS');
  // Overlap is evidence of an existing edit, never an inferred human label.
  return {
    slides: slides.filter(s => s.enabled && s.startSeconds * 1000 < unit.endMs
      && s.endSeconds * 1000 > unit.startMs),
    nearbySoundCues: sounds.filter(s => {
      const time = s.from / fps * 1000;
      return time >= unit.startMs - 1000 && time < unit.endMs + 1000;
    }).map(s => ({ ...s, startMs: s.from / fps * 1000 })),
  };
}

export function sampleIndices(total, limit) {
  assert(Number.isInteger(limit) && limit > 0 && limit <= total, `limit must be 1..${total}`);
  if (limit === 1) return [0];
  return Array.from({ length: limit }, (_, i) => Math.round(i * (total - 1) / (limit - 1)));
}

export function normalize(result) {
  const decisions = {};
  for (const [id, question] of Object.entries(questions)) {
    const answer = result.answers?.[id];
    const options = Object.keys(question.criteria);
    assert(answer?.type === 'choice' && options.includes(answer.choice), `Invalid choice: ${id}`);
    const probabilities = answer.probabilities;
    assert(probabilities && Object.keys(probabilities).length === options.length
      && options.every(key => Number.isFinite(probabilities[key])
        && probabilities[key] >= 0 && probabilities[key] <= 1), `Invalid probabilities: ${id}`);
    assert(Math.abs(Object.values(probabilities).reduce((a, b) => a + b, 0) - 1) <= 0.02,
      `Probabilities must sum to 1: ${id}`);
    // Provider confidence is NOT the probability of the selected option.
    const confidence = result.providerMetadata?.typesafe?.confidence?.[id] ?? null;
    assert(confidence === null || (Number.isFinite(confidence) && confidence >= 0 && confidence <= 1),
      `Invalid confidence: ${id}`);
    decisions[id] = {
      choice: answer.choice,
      value: id === 'visualAid' ? answer.choice : answer.choice === 'YES',
      probabilities,
      selectedProbability: probabilities[answer.choice],
      confidence,
      confidenceStatus: confidence === null ? 'not-returned' : 'provider-reported',
    };
  }
  return decisions;
}

export function labelsTemplate(dataset) {
  return {
    datasetId: dataset.datasetId,
    instructions: '完成動画の実際の編集を見て記入。nullは未判定。無演出・NOとは区別する。複合表現は主目的を一つ選びnotesへ補足。映像にない意図は推測しない。',
    units: dataset.units.map(u => ({
      id: u.id, visualAid: null, sectionChange: null, attentionReset: null,
      evidence: '', notes: '',
    })),
  };
}

export function compare(dataset, records, labels) {
  assert(labels.datasetId === dataset.datasetId, 'Human labels belong to a different dataset');
  const unitIds = new Set(dataset.units.map(u => u.id));
  const labelMap = new Map();
  for (const label of labels.units) {
    assert(unitIds.has(label.id) && !labelMap.has(label.id), 'Unknown or duplicate human label ID');
    for (const [key, question] of Object.entries(questions)) {
      assert(label[key] === null || (key === 'visualAid'
        ? Object.hasOwn(question.criteria, label[key]) : typeof label[key] === 'boolean'),
      `Invalid human label: ${key}`);
    }
    labelMap.set(label.id, label);
  }
  const scores = Object.fromEntries(Object.keys(questions).map(id => [id, { labeled: 0, matches: 0, agreement: null }]));
  const recordIds = new Set();
  const rows = records.map(record => {
    assert(unitIds.has(record.id) && !recordIds.has(record.id), 'Unknown or duplicate result ID');
    recordIds.add(record.id);
    const unit = dataset.units.find(u => u.id === record.id);
    const human = labelMap.get(record.id) ?? null;
    const matches = {};
    for (const key of Object.keys(questions)) {
      matches[key] = record.status === 'ok' && human?.[key] != null
        ? record.decisions[key].value === human[key] : null;
      if (matches[key] !== null) {
        scores[key].labeled++;
        scores[key].matches += Number(matches[key]);
      }
    }
    return { ...unit, result: record, human, matches };
  });
  for (const score of Object.values(scores)) {
    if (score.labeled) score.agreement = score.matches / score.labeled;
  }
  return { datasetId: dataset.datasetId, scores, rows };
}

const cell = (s) => String(s ?? '—').replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
const percent = value => value == null ? '未取得' : `${Number((value * 100).toFixed(4))}%`;
const distribution = (decision, key) => Object.keys(questions[key].criteria)
  .map(label => `${label}: ${percent(decision.probabilities[label])}`).join(' / ');
const costText = value => value == null ? '未取得' : `$${value}`;

export function summarize(comparison) {
  const successes = comparison.rows.filter(row => row.result.status === 'ok');
  const times = successes.map(row => row.result.elapsedMs).sort((a, b) => a - b);
  const total = getter => {
    const values = successes.map(getter);
    return values.length && values.every(v => v != null && Number.isFinite(Number(v)))
      ? Number(values.reduce((sum, value) => sum + Number(value), 0).toFixed(12)) : null;
  };
  return {
    successful: successes.length, attemptedSample: comparison.rows.length,
    choices: Object.fromEntries(Object.keys(questions).map(key => [key,
      Object.fromEntries(Object.keys(questions[key].criteria).map(choice => [choice,
        successes.filter(row => row.result.decisions[key].choice === choice).length])),
    ])),
    totalElapsedMs: total(row => row.result.elapsedMs),
    medianElapsedMs: times.length ? (times[Math.floor((times.length - 1) / 2)] + times[Math.floor(times.length / 2)]) / 2 : null,
    inputTokens: total(row => row.result.response?.usage?.inputTokens),
    outputTokens: total(row => row.result.response?.usage?.outputTokens),
    costs: Object.fromEntries(['cost', 'marketCost', 'gatewayCost', 'surchargeCost'].map(key =>
      [key, total(row => row.result.response?.costs?.[key])])),
  };
}

export function markdownReport(comparison) {
  const summary = summarize(comparison);
  const lines = ['# Jev / Episode 004 実験比較', '',
    'Jevはセリフだけを評価。実編集のcueは比較資料であり正解ラベルではありません。未記入の人間ラベルは一致率から除外します。', '',
    `成功 ${summary.successful}/${summary.attemptedSample}単位。3質問/単位。処理時間は通信・SDK処理を含むクライアント実測で、Jev内部の推論時間ではありません。`, '',
    `処理時間合計: ${summary.totalElapsedMs ?? '未取得'} ms / 中央値: ${summary.medianElapsedMs ?? '未取得'} ms。`,
    `トークン合計: 入力 ${summary.inputTokens ?? '未取得'} / 出力 ${summary.outputTokens ?? '未取得'}。`,
    `Gateway報告値（USD）: cost ${costText(summary.costs.cost)} / marketCost ${costText(summary.costs.marketCost)} / gatewayCost ${costText(summary.costs.gatewayCost)} / surchargeCost ${costText(summary.costs.surchargeCost)}。`, '',
    'コストはAPIの返却フィールドをそのまま区別して記録。marketCostをcostに加算しません。未取得は0と区別します。', '',
    '| 判断 | 人間ラベル件数 | 一致 | 一致率 |', '|---|---:|---:|---:|'];
  for (const [key, s] of Object.entries(comparison.scores)) {
    lines.push(`| ${key} | ${s.labeled} | ${s.matches} | ${s.agreement === null ? '未評価' : (s.agreement * 100).toFixed(1) + '%'} |`);
  }
  lines.push('', '一覧の各判断は「選択肢 / 選択確率 / provider confidence」。確率分布の詳細は下の各単位に記載。confidenceは0〜1で、選択確率や正解率とは区別します。', '',
    '| 単位 / 秒 | セリフ | 視覚補助 | セクション切替 | 注意回復 | 実際の図解 / 近傍SE | 人間ラベル |',
    '|---|---|---|---|---|---|---|');
  for (const row of comparison.rows) {
    const answer = key => row.result.status === 'ok'
      ? `${row.result.decisions[key].choice} / ${percent(row.result.decisions[key].selectedProbability)} / ${row.result.decisions[key].confidence ?? '未返却'}` : row.result.status;
    const human = Object.keys(questions).map(key => `${key}=${row.human?.[key] ?? '未判定'}`).join(', ');
    const edits = row.editingEvidence.slides.map(s => s.id).join(', ') + ' / '
      + row.editingEvidence.nearbySoundCues.map(s => s.id).join(', ');
    lines.push(`| ${row.id} / ${(row.startMs / 1000).toFixed(2)} | ${cell(row.text)} | ${answer('visualAid')} | ${answer('sectionChange')} | ${answer('attentionReset')} | ${cell(edits)} | ${cell(human)} |`);
  }
  lines.push('', '## 使用量・処理時間', '',
    '| 単位 | ms | 入力token | 出力token | cost USD | marketCost USD | gatewayCost USD | surchargeCost USD |',
    '|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const row of comparison.rows) {
    const r = row.result;
    lines.push(`| ${row.id} | ${r.elapsedMs ?? '未取得'} | ${r.response?.usage?.inputTokens ?? '未取得'} | ${r.response?.usage?.outputTokens ?? '未取得'} | ${['cost', 'marketCost', 'gatewayCost', 'surchargeCost'].map(key => costText(r.response?.costs?.[key])).join(' | ')} |`);
  }
  for (const row of comparison.rows) {
    lines.push('', `## ${row.id} / ${(row.startMs / 1000).toFixed(2)}–${(row.endMs / 1000).toFixed(2)} 秒`, '',
      `> ${row.text.replaceAll('\n', '\n> ')}`, '');
    if (row.result.status !== 'ok') {
      lines.push(`結果: ${row.result.status}`);
      continue;
    }
    lines.push('| 判断 | 選択 | 全選択肢の確率 | confidence |', '|---|---|---|---:|');
    for (const key of Object.keys(questions)) {
      const d = row.result.decisions[key];
      lines.push(`| ${key} | ${d.choice} | ${distribution(d, key)} | ${d.confidence ?? '未返却'} |`);
    }
  }
  return lines.join('\n') + '\n';
}

export function csvReport(comparison) {
  const headers = ['id', 'startSeconds', 'endSeconds', 'text', 'status'];
  for (const [key, q] of Object.entries(questions)) {
    headers.push(`${key}_choice`, ...Object.keys(q.criteria).map(option => `p_${key === 'visualAid' ? 'visual' : key}_${option}`), `confidence_${key}`);
  }
  headers.push('elapsedMs', 'inputTokens', 'outputTokens', 'cost_usd', 'marketCost_usd', 'gatewayCost_usd', 'surchargeCost_usd', 'existingSlides', 'nearbySE');
  const rows = comparison.rows.map(row => {
    const values = [row.id, row.startMs / 1000, row.endMs / 1000, row.text.replace(/[\r\n]+/g, ' '), row.result.status];
    for (const [key, q] of Object.entries(questions)) {
      const d = row.result.decisions?.[key];
      values.push(d?.choice, ...Object.keys(q.criteria).map(option => d?.probabilities[option]), d?.confidence);
    }
    values.push(row.result.elapsedMs, row.result.response?.usage?.inputTokens, row.result.response?.usage?.outputTokens,
      ...['cost', 'marketCost', 'gatewayCost', 'surchargeCost'].map(key => row.result.response?.costs?.[key]),
      row.editingEvidence.slides.map(s => s.id).join('; '), row.editingEvidence.nearbySoundCues.map(s => s.id).join('; '));
    return values;
  });
  const escape = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
  // UTF-8 BOM for Japanese Excel users; probabilities are raw 0..1 numbers.
  return '\uFEFF' + [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n') + '\r\n';
}
