import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import './rsvp-controls';
import { jest } from "@jest/globals";
import { RsvpControls } from './rsvp-controls';

describe('RsvpControls', () => {
  const TAG = 'rsvp-controls';

  beforeEach(() => {
    if (!customElements.get(TAG)) {
      customElements.define(TAG, RsvpControls);
    }
    document.body.innerHTML = `<${TAG}></${TAG}>`;
  });

  it('dispatches events on button click', async () => {
    const el = document.querySelector(TAG) as RsvpControls;
    await el.updateComplete;
    const events: Array<[string, string]> = [
      ['play-pause', el.playing ? 'Pause' : 'Play'],
      ['rewind', 'Rewind'],
      ['fast-forward', 'Fast Forward'],
      ['decrease-speed', 'Decrease speed'],
      ['increase-speed', 'Increase speed'],
      ['toggle-fullscreen', 'Toggle Fullscreen'],
      ['toggle-settings', 'Settings'],
    ];

    for (const [eventName, label] of events) {
      const button = el.shadowRoot!.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
      const listener = jest.fn();
      el.addEventListener(eventName, listener);
      fireEvent.click(button);
      expect(listener).toHaveBeenCalled();
      el.removeEventListener(eventName, listener);
    }
  });

  it('updates play/pause label based on state', async () => {
    const el = document.querySelector(TAG) as RsvpControls;
    await el.updateComplete;
    let button = el.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="Play"]')!;
    expect(button).toBeInTheDocument();

    el.playing = true;
    await el.updateComplete;
    button = el.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="Pause"]')!;
    expect(button).toBeInTheDocument();
  });

  it('includes mobile styles', () => {
    const css = Array.isArray(RsvpControls.styles) ? RsvpControls.styles.map(s => s.cssText).join('') : RsvpControls.styles.cssText;
    expect(css).toMatch(/@media\s*\(max-width: 600px\)/);
    expect(css).toMatch(/flex-wrap:\s*wrap/);
  });
});
