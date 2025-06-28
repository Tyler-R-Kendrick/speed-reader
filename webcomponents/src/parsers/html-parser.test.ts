import { HtmlParser } from './content-parser';

describe('HtmlParser', () => {
  it('extracts visible text from html', () => {
    const html = `<!DOCTYPE html>
      <html><head><style>.a{}</style><script>1</script></head>
      <body><article><h1>Hello</h1><!--comment--><p>World &amp; <b>friends</b></p></article></body></html>`;
    const parser = new HtmlParser();
    expect(parser.parse(html)).toBe('Hello World & friends');
  });
});
