import { MarkdownParser } from './content-parser';

describe('MarkdownParser', () => {
  it('extracts text from markdown', async () => {
    const md = '# Hello **World**';
    const parser = new MarkdownParser();
    await expect(parser.parse(md)).resolves.toBe('Hello World');
  });
});
