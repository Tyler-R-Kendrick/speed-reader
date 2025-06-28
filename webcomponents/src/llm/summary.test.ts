import { jest } from '@jest/globals';
import { requestSummary, LlmConfig } from './summary';

describe('requestSummary', () => {
  it('posts to OpenRouter and returns summary', async () => {
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'summary' } }] }),
      })
    );
    (global as any).fetch = fetchMock;
    const cfg: LlmConfig = {
      provider: 'openrouter',
      apiKey: 'k',
      model: 'gpt',
    };
    const result = await requestSummary('hello', cfg);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toBe('summary');
  });

  it('throws on non-ok response', async () => {
    const fetchMock = jest.fn(() => Promise.resolve({ ok: false }));
    (global as any).fetch = fetchMock;
    const cfg: LlmConfig = { provider: 'openrouter', apiKey: 'k', model: 'gpt' };
    await expect(requestSummary('bad', cfg)).rejects.toThrow('LLM request failed');
  });
});
