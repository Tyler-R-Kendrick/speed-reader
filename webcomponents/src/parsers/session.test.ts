import { parseText } from './tokenizer';
import { parseSession, serializeSession } from './session';

describe('Session serialization', () => {
  it('serializes and parses tokens', () => {
    const tokens = parseText('Hello world?');
    const json = serializeSession(tokens);
    const parsed = parseSession(json);
    expect(parsed).toEqual(tokens);
  });
});
