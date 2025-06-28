export interface LlmConfig {
  provider: 'openrouter' | 'openai';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export async function requestSummary(
  text: string,
  config: LlmConfig
): Promise<string> {
  const url =
    config.provider === 'openai'
      ? config.baseUrl ?? 'https://api.openai.com/v1/chat/completions'
      : config.baseUrl ?? 'https://openrouter.ai/api/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content:
            'Summarize the following text in a short paragraph suitable for speed reading.',
        },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error('LLM request failed');
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
