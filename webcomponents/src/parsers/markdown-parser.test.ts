import { MarkdownParser } from './content-parser';

describe('MarkdownParser', () => {
  it('extracts text from markdown', () => {
    const md = '# Hello **World**';
    const parser = new MarkdownParser();
    expect(parser.parse(md)).toBe('Hello World');
  });
});
