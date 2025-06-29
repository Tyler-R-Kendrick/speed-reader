import { TextParser } from './content-parser';

describe('TextParser', () => {
  it('returns the text unchanged', async () => {
    const parser = new TextParser();
    await expect(parser.parse('Hello world')).resolves.toBe('Hello world');
  });
});
