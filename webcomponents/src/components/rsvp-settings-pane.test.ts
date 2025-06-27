import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { RsvpPlayer } from './rsvp-player';

const PLAYER_TAG = 'rsvp-player';
const SETTINGS_TAG = 'rsvp-settings';
const TEXT = 'hello world';
if (!customElements.get(PLAYER_TAG)) {
  customElements.define(PLAYER_TAG, RsvpPlayer);
}

describe('RsvpPlayer settings pane', () => {
  it('shows settings pane when settings button clicked', async () => {
    document.body.innerHTML = `<${PLAYER_TAG} text="${TEXT}"></${PLAYER_TAG}>`;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const controls = el.shadowRoot!.querySelector('rsvp-controls')!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector('button[aria-label="Settings"]') as HTMLButtonElement;
    expect(button).toBeVisible();
    expect(button.getAttribute('part')).toBe('settings-button');
    const icon = button.querySelector('svg');
    expect(icon).toBeTruthy();
    fireEvent.click(button);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(SETTINGS_TAG)).toBeInTheDocument();
  });

  it('shows settings pane on swipe up gesture', async () => {
    document.body.innerHTML = `<${PLAYER_TAG} text="${TEXT}"></${PLAYER_TAG}>`;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const down = new Event('pointerdown');
    Object.assign(down, { pointerType: 'touch', clientY: 300 });
    el.dispatchEvent(down);
    const up = new Event('pointerup');
    Object.assign(up, { pointerType: 'touch', clientY: 200 });
    el.dispatchEvent(up);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(SETTINGS_TAG)).toBeInTheDocument();
  });

  it('closes settings pane on swipe down gesture', async () => {
    document.body.innerHTML = `<${PLAYER_TAG} text="${TEXT}"></${PLAYER_TAG}>`;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const controls = el.shadowRoot!.querySelector('rsvp-controls')!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector('button[aria-label="Settings"]') as HTMLButtonElement;
    fireEvent.click(button);
    await el.updateComplete;
    const settings = el.shadowRoot!.querySelector(SETTINGS_TAG)!;

    const down = new Event('pointerdown');
    Object.assign(down, { pointerType: 'touch', clientY: 100 });
    settings.dispatchEvent(down);
    const up = new Event('pointerup');
    Object.assign(up, { pointerType: 'touch', clientY: 200 });
    settings.dispatchEvent(up);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(SETTINGS_TAG)).not.toBeInTheDocument();
  });
});
