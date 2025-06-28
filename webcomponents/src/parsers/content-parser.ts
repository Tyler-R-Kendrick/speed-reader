export interface ContentParser {
  parse(content: string): string;
}

/**
 * Pass-through parser for plain text input.
 */
export class TextParser implements ContentParser {
  parse(content: string): string {
    return content;
  }
}

/**
 * Simple HTML parser that extracts visible text content from an HTML document.
 * It removes script, style and other non-content elements before gathering
 * text from the <article> element if present, falling back to <body>.
 */
export class HtmlParser implements ContentParser {
  parse(content: string): string {
    const doc = new DOMParser().parseFromString(content, 'text/html');

    for (const el of doc.querySelectorAll('script,style,noscript,template,head')) {
      el.remove();
    }

    const container = doc.querySelector('article') ?? doc.body;
    if (!container) {
      return '';
    }
    const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let text = '';
    while (walker.nextNode()) {
      const value = walker.currentNode.nodeValue?.trim() ?? '';
      if (value) {
        text += `${value} `;
      }
    }
    return text.replaceAll(/\s+/g, ' ').trim();
  }
}

export function getParser(type: string): ContentParser {
  switch (type) {
    case 'html':
      return new HtmlParser();
    case 'text':
      return new TextParser();
    default:
      return new TextParser();
  }
}
