import { HtmlParser } from './content-parser';

describe('HtmlParser', () => {
  it('extracts visible text from html', async () => {
    const html = `<!DOCTYPE html>
      <html><head><style>.a{}</style><script>1</script></head>
      <body><article><h1>Hello</h1><!--comment--><p>World &amp; <b>friends</b></p></article></body></html>`;
    const parser = new HtmlParser();
    await expect(parser.parse(html)).resolves.toBe('Hello World & friends');
  });
});
