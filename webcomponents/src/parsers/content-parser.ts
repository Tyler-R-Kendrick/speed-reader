export interface ContentParser {
  parse(content: string | ArrayBuffer): Promise<string>;
}

/**
 * Pass-through parser for plain text input.
 */
export class TextParser implements ContentParser {
  async parse(content: string | ArrayBuffer): Promise<string> {
    return typeof content === 'string'
      ? content
      : new TextDecoder().decode(content);
  }
}

import { marked } from 'marked';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Parse markdown by converting it to HTML and then extracting text using the
 * existing HtmlParser logic. This keeps behaviour consistent across formats.
 */
export class MarkdownParser implements ContentParser {
  private _htmlParser = new HtmlParser();

  async parse(content: string | ArrayBuffer): Promise<string> {
    const text = typeof content === 'string'
      ? content
      : new TextDecoder().decode(content);
    const html = marked.parse(text);
    return this._htmlParser.parse(html);
  }
}

/**
 * Simple HTML parser that extracts visible text content from an HTML document.
 * It removes script, style and other non-content elements before gathering
 * text from the <article> element if present, falling back to <body>.
 */
export class HtmlParser implements ContentParser {
  async parse(content: string | ArrayBuffer): Promise<string> {
    const input = typeof content === 'string'
      ? content
      : new TextDecoder().decode(content);
    const doc = new DOMParser().parseFromString(input, 'text/html');

    for (const el of doc.querySelectorAll('script,style,noscript,template,head')) {
      el.remove();
    }

    const container = doc.querySelector('article') ?? doc.body;
    if (!container) {
      return '';
    }
    const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let result = '';
    while (walker.nextNode()) {
      const value = walker.currentNode.nodeValue?.trim() ?? '';
      if (value) {
        result += `${value} `;
      }
    }
    return result.replaceAll(/\s+/g, ' ').trim();
  }
}

/**
 * Extract text content from a PDF document using pdfjs.
 */
export class PdfParser implements ContentParser {
  async parse(content: ArrayBuffer | string): Promise<string> {
    const data = typeof content === 'string'
      ? new TextEncoder().encode(content)
      : new Uint8Array(content);
    const pdf = await getDocument({ data, useWorkerFetch: false }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const txt = await page.getTextContent();
      for (const item of txt.items) {
        if ('str' in item) {
          text += `${(item as { str: string }).str} `;
        }
      }
    }
    return text.replaceAll(/\s+/g, ' ').trim();
  }
}

export function getParser(type: string): ContentParser {
  switch (type) {
    case 'html':
      return new HtmlParser();
    case 'markdown':
    case 'md':
      return new MarkdownParser();
    case 'pdf':
      return new PdfParser();
    case 'text':
      return new TextParser();
    default:
      return new TextParser();
  }
}
