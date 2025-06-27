import '@testing-library/jest-dom';
import { RsvpPlayer } from './rsvp-player';

describe('RsvpPlayer mobile layout', () => {
  it('includes mobile fullscreen styles', () => {
    const css = Array.isArray(RsvpPlayer.styles) ? RsvpPlayer.styles.map(s => s.cssText).join('') : RsvpPlayer.styles.cssText;
    expect(css).toMatch(/@media\s*\(max-width: 600px\)/);
    expect(css).toMatch(/min-height:\s*100dvh/);
    expect(css).toMatch(/width:\s*100vw/);
  });
});
