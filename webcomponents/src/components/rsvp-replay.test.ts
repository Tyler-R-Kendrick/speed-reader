import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { RsvpPlayer } from './rsvp-player';

const TAG = 'rsvp-player';

if (!customElements.get(TAG)) {
  customElements.define(TAG, RsvpPlayer);
}

describe('RsvpPlayer replay control', () => {
  it('switches to replay at end and back to play/pause after press', async () => {
    jest.useFakeTimers();
    document.body.innerHTML = `<${TAG} text="one two"></${TAG}>`;
    const el = document.querySelector<RsvpPlayer>(TAG)!;
    await el.updateComplete;
    const controls = el.shadowRoot!.querySelector('rsvp-controls')!;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector('button') as HTMLButtonElement;

    // start playback
    fireEvent.click(button);
    await el.updateComplete;

    const interval = 60000 / el.wpm;
    jest.advanceTimersByTime(interval * el.text.split(/\s+/).length);
    await el.updateComplete;
    await (controls as any).updateComplete;

    expect(button.getAttribute('aria-label')).toBe('Replay');

    // press replay
    fireEvent.click(button);
    await el.updateComplete;
    await (controls as any).updateComplete;
    expect(button.getAttribute('aria-label')).toBe('Pause');
    jest.useRealTimers();
  });
});
