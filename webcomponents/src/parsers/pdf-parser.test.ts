import { jest } from '@jest/globals';

if (typeof globalThis.structuredClone !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).structuredClone = (value: unknown) =>
    JSON.parse(JSON.stringify(value));
}
import { PdfParser } from './content-parser';

describe('PdfParser', () => {
  it.skip('extracts text from a simple pdf', async () => {
    const parser = new PdfParser();
    const data = new Uint8Array([0]);
    await expect(parser.parse(data)).resolves.toBe('Hello World');
  });
});
