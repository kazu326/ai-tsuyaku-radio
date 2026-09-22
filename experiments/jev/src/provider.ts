import { createGateway, experimental_evaluate as evaluate } from 'ai';
import { MODEL, questions } from './questions.ts';

// No dotenv auto-discovery: credentials must already be in process.env.
export function createEvaluator(apiKey = process.env.AI_GATEWAY_API_KEY, fetchImpl?: typeof globalThis.fetch) {
  if (!apiKey?.trim()) throw new Error('AI_GATEWAY_API_KEY is required');
  const gateway = createGateway({ apiKey, fetch: fetchImpl });
  return (state: Parameters<typeof evaluate>[0]['state']) => evaluate({
    model: gateway.evaluationModel(MODEL),
    state,
    questions,
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(30_000),
  });
}
