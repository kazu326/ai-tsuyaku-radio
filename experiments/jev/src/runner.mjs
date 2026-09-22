import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';
import { stateFor, questions, MODEL, normalize } from './core.mjs';

// Raw errors/headers may contain credentials or provider request bodies. Never persist them.
export function safeError(error) {
  const status = Number.isInteger(error?.statusCode) ? error.statusCode : null;
  return {
    code: error?.name === 'TimeoutError' || error?.name === 'AbortError' ? 'TIMEOUT'
      : status === 401 ? 'AUTH' : status === 403 ? 'FORBIDDEN'
      : status === 429 ? 'RATE_LIMIT' : 'EVALUATION_FAILED',
    httpStatus: status,
  };
}

export async function runEvaluations(dataset, indices, evaluate, append, progress = () => {}, intervalMs = 0) {
  const records = [];
  let stopped = false;
  for (const index of indices) {
    // Pacing is outside the measured API duration and never retries a completed call.
    if (!stopped && records.length && intervalMs) await delay(intervalMs);
    const id = dataset.units[index].id;
    const request = { model: MODEL, state: stateFor(dataset.units, index), questions,
      maxRetries: 0, timeoutMs: 30000, providerOptions: {} };
    // Persist the exact logical input BEFORE the API call, to retain interrupted requests.
    if (!stopped) await append({ event: 'request', id, request, at: new Date().toISOString() });
    const started = performance.now();
    let record;
    if (stopped) {
      record = { id, status: 'skipped', reason: 'Stopped after first failure' };
    } else {
      try {
        const result = await evaluate(request.state);
        record = {
          id, status: 'ok', elapsedMs: Math.round(performance.now() - started),
          decisions: normalize(result),
          response: {
            // Native answers retained; no response headers, credentials or arbitrary metadata.
            answers: result.answers,
            confidence: result.providerMetadata?.typesafe?.confidence ?? null,
            usage: result.usage,
            // Only known monetary fields; retain provider precision, never infer missing cost.
            costs: Object.fromEntries(['cost', 'marketCost', 'gatewayCost', 'surchargeCost'].map(key => {
              const value = result.providerMetadata?.gateway?.[key];
              return [key, (typeof value === 'number' || (typeof value === 'string' && value.trim() !== ''))
                && Number.isFinite(Number(value)) && Number(value) >= 0 ? value : null];
            })),
            rounding: result.rounding ?? null,
            modelId: result.response?.modelId ?? MODEL,
            timestamp: result.response?.timestamp ?? null,
            warningCount: result.warnings?.length ?? 0,
          },
        };
      } catch (error) {
        record = { id, status: 'error', elapsedMs: Math.round(performance.now() - started), error: safeError(error) };
        stopped = true;
      }
    }
    records.push(record);
    await append({ event: 'result', ...record });
    progress(record, records.length, indices.length);
  }
  return records;
}
