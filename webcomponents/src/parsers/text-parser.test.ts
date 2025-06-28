import { TextParser } from './content-parser';

describe('TextParser', () => {
  it('returns the text unchanged', () => {
    const parser = new TextParser();
    expect(parser.parse('Hello world')).toBe('Hello world');
  });
});
