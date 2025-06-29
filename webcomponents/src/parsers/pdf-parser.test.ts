import { PdfParser } from './content-parser';
import fs from 'fs';

describe('PdfParser', () => {
  it('extracts text from a simple pdf', async () => {
    const data = fs.readFileSync(__dirname + '/sample.pdf');
    const parser = new PdfParser();
    await expect(parser.parse(data)).resolves.toBe('Hello World');
  });
});
