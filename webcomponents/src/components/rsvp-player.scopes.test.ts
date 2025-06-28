import '@testing-library/jest-dom';
import { RsvpPlayer } from './rsvp-player';
import { parseText } from '../parsers/tokenizer';
import { serializeSession } from '../parsers/session';

const TAG = 'rsvp-player';

if (!customElements.get(TAG)) {
  customElements.define(TAG, RsvpPlayer);
}

describe('RsvpPlayer punctuation scopes', () => {
  const TEXT = 'I like eggs (I like the shape of them - as geometry is my "raison detre")';

  beforeEach(() => {
    document.body.innerHTML = `<${TAG}></${TAG}>`;
  });

  it('renders nested punctuation scopes', async () => {
    const el = document.querySelector<RsvpPlayer>(TAG)!;
    el.session = serializeSession(parseText(TEXT));
    await el.updateComplete;

    (el as any).index = 6; // word "shape"
    await el.updateComplete;
    let wordEl = el.shadowRoot!.querySelector('.word') as HTMLElement;
    expect(wordEl).toHaveTextContent('(shape)');

    (el as any).index = 14; // word "raison"
    await el.updateComplete;
    wordEl = el.shadowRoot!.querySelector('.word') as HTMLElement;
    expect(wordEl).toHaveTextContent('("raison")');
  });
});
