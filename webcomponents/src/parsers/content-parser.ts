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

/**
 * Parse markdown by converting it to HTML and then extracting text using the
 * existing HtmlParser logic. This keeps behaviour consistent across formats.
 */
export class MarkdownParser implements ContentParser {
  private _htmlParser = new HtmlParser();

  async parse(content: string | ArrayBuffer): Promise<string> {
    const text =
      typeof content === 'string'
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
    const source =
      typeof content === 'string'
        ? content
        : new TextDecoder().decode(content);
    const doc = new DOMParser().parseFromString(source, 'text/html');

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

import JSZip from 'jszip';

/**
 * Parse docx files by extracting text from word/document.xml.
 */
export class DocxParser implements ContentParser {
  async parse(content: string | ArrayBuffer): Promise<string> {
    const buffer =
      typeof content === 'string'
        ? new TextEncoder().encode(content).buffer
        : content;
    // eslint-disable-next-line sonarjs/no-unsafe-unzip
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file('word/document.xml')?.async('text');
    if (!xml) {
      return '';
    }
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    return (
      doc.documentElement?.textContent?.replaceAll(/\s+/g, ' ').trim() ?? ''
    );
  }
}

/**
 * Parse OpenDocument text (.odt) files by extracting text from content.xml.
 */
export class OdtParser implements ContentParser {
  async parse(content: string | ArrayBuffer): Promise<string> {
    const buffer =
      typeof content === 'string'
        ? new TextEncoder().encode(content).buffer
        : content;
    // The archive is user-provided but contains only text; parsing in memory is acceptable
    // eslint-disable-next-line sonarjs/no-unsafe-unzip
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file('content.xml')?.async('text');
    if (!xml) {
      return '';
    }
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    return (
      doc.documentElement?.textContent?.replaceAll(/\s+/g, ' ').trim() ?? ''
    );
  }
}

export function getParser(type: string): ContentParser {
  switch (type) {
    case 'html':
      return new HtmlParser();
    case 'docx':
      return new DocxParser();
    case 'odt':
      return new OdtParser();
    case 'markdown':
    case 'md':
      return new MarkdownParser();
    case 'text':
      return new TextParser();
    default:
      return new TextParser();
  }
}
