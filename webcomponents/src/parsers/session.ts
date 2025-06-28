export interface SessionToken {
  text: string;
  scopes: string[];
  markers: string[];
  delay: number;
}

export interface SessionData {
  tokens: SessionToken[];
}

import type { Token } from './tokenizer';

export function tokensToSession(tokens: Token[]): SessionData {
  return {
    tokens: tokens.map(t => ({
      text: t.text,
      scopes: t.scopes,
      markers: t.markers,
      delay: t.extraPause,
    })),
  };
}

export function sessionToTokens(session: SessionData): Token[] {
  return session.tokens.map(t => ({
    text: t.text,
    scopes: t.scopes ?? [],
    markers: t.markers ?? [],
    extraPause: t.delay ?? 0,
  }));
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
