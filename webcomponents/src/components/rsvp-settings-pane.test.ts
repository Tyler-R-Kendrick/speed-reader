import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { RsvpPlayer } from './rsvp-player';

const PLAYER_TAG = 'rsvp-player';
const SETTINGS_TAG = 'rsvp-settings';
const CONTROLS_TAG = 'rsvp-controls';
const SETTINGS_BUTTON_SELECTOR = 'button[aria-label="Settings"]';
const TEXT = 'hello world';
const TEMPLATE = `<${PLAYER_TAG} text="${TEXT}"></${PLAYER_TAG}>`;
if (!customElements.get(PLAYER_TAG)) {
  customElements.define(PLAYER_TAG, RsvpPlayer);
}

describe('RsvpPlayer settings pane', () => {
  it('shows settings pane when settings button clicked', async () => {
    document.body.innerHTML = TEMPLATE;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const controls = el.shadowRoot!.querySelector(CONTROLS_TAG)!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector(SETTINGS_BUTTON_SELECTOR) as HTMLButtonElement;
    expect(button).toBeVisible();
    expect(button.getAttribute('part')).toBe('settings-button');
    const icon = button.querySelector('svg');
    expect(icon).toBeTruthy();
    fireEvent.click(button);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(SETTINGS_TAG)).toBeInTheDocument();
  });

  it('shows settings pane on swipe up gesture', async () => {
    document.body.innerHTML = TEMPLATE;
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
    document.body.innerHTML = TEMPLATE;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const controls = el.shadowRoot!.querySelector(CONTROLS_TAG)!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector(SETTINGS_BUTTON_SELECTOR) as HTMLButtonElement;
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

  it('prevents default page refresh when swiping', async () => {
    document.body.innerHTML = TEMPLATE;
    const el = document.querySelector(PLAYER_TAG)! as RsvpPlayer;
    await el.updateComplete;

    const controls = el.shadowRoot!.querySelector(CONTROLS_TAG)!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector(SETTINGS_BUTTON_SELECTOR) as HTMLButtonElement;
    fireEvent.click(button);
    await el.updateComplete;
    const settings = el.shadowRoot!.querySelector(SETTINGS_TAG)!;

    const ev = new TouchEvent('touchstart', { cancelable: true, touches: [{ clientY: 50 }] } as any);
    const prevent = jest.spyOn(ev, 'preventDefault');
    settings.dispatchEvent(ev);
    expect(prevent).toHaveBeenCalled();
  });
});
