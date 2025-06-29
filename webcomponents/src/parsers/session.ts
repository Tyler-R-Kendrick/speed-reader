export interface SessionToken {
  text: string;
  scopes: string[];
  delay: number;
}

export interface SessionSentence {
  tokens: SessionToken[];
  markers: string[];
}

export interface SessionData {
  sentences: SessionSentence[];
}

import type { Token } from './tokenizer';

export function tokensToSession(tokens: Token[]): SessionData {
  const sentences: SessionSentence[] = [];
  let current: SessionSentence = { tokens: [], markers: [] };

  for (const token of tokens) {
    current.tokens.push({
      text: token.text,
      scopes: token.scopes,
      delay: token.extraPause,
    });

    if (token.sentenceEnd) {
      current.markers = token.markers;
      sentences.push(current);
      current = { tokens: [], markers: [] };
    }
  }

  if (current.tokens.length > 0) {
    sentences.push(current);
  }

  return { sentences };
}

export function sessionToTokens(session: SessionData): Token[] {
  const tokens: Token[] = [];
  for (const sentence of session.sentences) {
    for (const [idx, t] of sentence.tokens.entries()) {
      tokens.push({
        text: t.text,
        scopes: t.scopes ?? [],
        markers: sentence.markers ?? [],
        extraPause: t.delay ?? 0,
        sentenceEnd: idx === sentence.tokens.length - 1,
      });
    }
  }
  return tokens;
}

export function serializeSession(tokens: Token[]): string {
  return JSON.stringify(tokensToSession(tokens));
}

export function parseSession(json: string): Token[] {
  if (!json) {
    return [];
  }
  const data = JSON.parse(json) as SessionData;
  return sessionToTokens(data);
}
