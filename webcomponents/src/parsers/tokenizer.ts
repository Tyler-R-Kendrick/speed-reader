export interface Token {
  text: string;
  scopes: string[];
  markers: string[];
  extraPause: number;
  sentenceEnd?: boolean;
}

const OPENERS = ['(', '[', '{', '"', "'"] as const;
const CLOSERS: Record<string, string> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '"': '"',
  "'": "'",
};

/* eslint-disable max-lines-per-function, sonarjs/cognitive-complexity, complexity */
export function parseText(text: string): Token[] {
  const tokens: Token[] = [];
  const stack: string[] = [];
  let word = '';
  let sentenceIndices: number[] = [];

  const pushWord = () => {
    if (word) {
      tokens.push({ text: word, scopes: [...stack], markers: [], extraPause: 0, sentenceEnd: false });
      sentenceIndices.push(tokens.length - 1);
      word = '';
    }
  };

  for (let i = 0; i < text.length;) {
    const ch = text[i];

    if (text.slice(i, i + 3) === '...') {
      pushWord();
      for (let j = 1; j <= 3; j++) {
        tokens.push({ text: '.'.repeat(j), scopes: [...stack], markers: [], extraPause: 0 });
        sentenceIndices.push(tokens.length - 1);
      }
      i += 3;
      continue;
    }

    if ((OPENERS as readonly string[]).includes(ch)) {
      pushWord();
      stack.push(ch);
      i++;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(CLOSERS, ch)) {
      pushWord();
      if (stack.at(-1) === CLOSERS[ch]) {
        stack.pop();
      }
      i++;
      continue;
    }

    if (/\s/.test(ch)) {
      pushWord();
      i++;
      continue;
    }

    if (ch === ',') {
      pushWord();
      if (tokens.length > 0) {
        const last = tokens.at(-1)!;
        last.extraPause += 1;
      }
      i++;
      continue;
    }

    if (ch === ':' || ch === ';') {
      pushWord();
      if (tokens.length > 0) {
        const last = tokens.at(-1)!;
        last.extraPause += 1;
      }
      i++;
      continue;
    }

    if (ch === '.' || ch === '!' || ch === '?') {
      pushWord();
      let j = i;
      const markers: string[] = [];
      while (j < text.length) {
        if (text.slice(j, j + 3) === '...') {
          break;
        }
        const c = text[j];
        if (c === '!' || c === '?') {
          markers.push(c);
        } else if (c !== '.') {
          break;
        }
        j++;
      }
      const dedup = [...new Set(markers)];
      for (const idx of sentenceIndices) {
        tokens[idx].markers = dedup;
      }
      if (sentenceIndices.length > 0) {
        tokens[sentenceIndices.at(-1)!].sentenceEnd = true;
      }
      sentenceIndices = [];
      i = j;
      continue;
    }

    word += ch;
    i++;
  }
  pushWord();
  if (sentenceIndices.length > 0) {
    tokens[sentenceIndices.at(-1)!].sentenceEnd = true;
  }
  return tokens;
}
/* eslint-enable max-lines-per-function, sonarjs/cognitive-complexity */
