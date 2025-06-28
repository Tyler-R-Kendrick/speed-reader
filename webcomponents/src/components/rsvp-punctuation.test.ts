import '@testing-library/jest-dom';
import { parseText } from './rsvp-player';

describe('parseText punctuation rules', () => {
  it('assigns question marker to sentence words', () => {
    const tokens = parseText('Hello world?');
    expect(tokens[0].markers).toEqual(['?']);
    expect(tokens[1].markers).toEqual(['?']);
  });

  it('handles combined markers', () => {
    const tokens = parseText('Really?!');
    expect(tokens[0].markers.sort()).toEqual(['!', '?']);
  });

  it('creates incremental ellipsis tokens', () => {
    const tokens = parseText('Wait...');
    expect(tokens.map(t => t.text)).toEqual(['Wait', '.', '..', '...']);
  });

  it('adds pause after comma', () => {
    const tokens = parseText('Hello, world');
    expect(tokens[0].extraPause).toBe(1);
    expect(tokens[1].extraPause).toBe(0);
  });

  it('adds pause after colon', () => {
    const tokens = parseText('Key: value');
    expect(tokens.map(t => t.text)).toEqual(['Key', 'value']);
    expect(tokens[0].extraPause).toBe(1);
  });

  it('adds pause after semicolon', () => {
    const tokens = parseText('First; second');
    expect(tokens.map(t => t.text)).toEqual(['First', 'second']);
    expect(tokens[0].extraPause).toBe(1);
  });
});
