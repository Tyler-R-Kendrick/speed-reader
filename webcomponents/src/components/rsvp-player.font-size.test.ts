import '@testing-library/jest-dom';
import { RsvpPlayer } from './rsvp-player';
import { parseText } from '../parsers/tokenizer';
import { serializeSession } from '../parsers/session';

const TAG = 'rsvp-player';

if (!customElements.get(TAG)) {
  customElements.define(TAG, RsvpPlayer);
}

describe('RsvpPlayer font sizing', () => {
  beforeEach(() => {
    document.body.innerHTML = `<${TAG}></${TAG}>`;
  });

  it('sets constant font size based on longest word', async () => {
    const el = document.querySelector<RsvpPlayer>(TAG)!;
    el.session = serializeSession(parseText('longword ... short'));
    (el as any).getBoundingClientRect = () => ({
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    await el.updateComplete;
    (el as any)._updateFontSize();
    const sizeVar = el.style.getPropertyValue('--rsvp-font-size');
    expect(sizeVar).not.toBe('');
    const word = el.shadowRoot!.querySelector('.word') as HTMLElement;
    const style = getComputedStyle(word);
    expect(style.minHeight).not.toBe('0px');
  });
});
