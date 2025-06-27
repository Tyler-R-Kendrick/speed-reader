import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { RsvpPlayer } from './rsvp-player';

const PLAYER_TAG = 'rsvp-player';
if (!customElements.get(PLAYER_TAG)) {
  customElements.define(PLAYER_TAG, RsvpPlayer);
}

describe('RsvpPlayer settings pane', () => {
  it('shows settings pane when settings button clicked', async () => {
    document.body.innerHTML = `<${PLAYER_TAG} text="hello world"></${PLAYER_TAG}>`;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const controls = el.shadowRoot!.querySelector('rsvp-controls')!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector('button[aria-label="Settings"]') as HTMLButtonElement;
    fireEvent.click(button);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('rsvp-settings')).toBeInTheDocument();
  });

  it('shows settings pane on swipe up gesture', async () => {
    document.body.innerHTML = `<${PLAYER_TAG} text="hello world"></${PLAYER_TAG}>`;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const down = new Event('pointerdown');
    Object.assign(down, { pointerType: 'touch', clientY: 300 });
    el.dispatchEvent(down);
    const up = new Event('pointerup');
    Object.assign(up, { pointerType: 'touch', clientY: 200 });
    el.dispatchEvent(up);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('rsvp-settings')).toBeInTheDocument();
  });
});
