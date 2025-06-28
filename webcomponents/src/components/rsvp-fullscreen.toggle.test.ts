import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { RsvpPlayer } from './rsvp-player';
import './rsvp-controls';
const FS_SELECTOR = 'button[aria-label="Toggle Fullscreen"]';
const CONTROLS_TAG = 'rsvp-controls';

describe('Fullscreen controls', () => {
  const TAG = 'rsvp-player';

  beforeEach(() => {
    if (!customElements.get(TAG)) {
      customElements.define(TAG, RsvpPlayer);
    }
    document.body.innerHTML = `<${TAG}></${TAG}>`;
  });

  it('renders standard fullscreen icons', async () => {
    const el = document.querySelector<RsvpPlayer>(TAG)!;
    await el.updateComplete;
    const controls = el.shadowRoot!.querySelector(CONTROLS_TAG) as HTMLElement;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector(FS_SELECTOR) as HTMLButtonElement;
    expect(button.querySelector('sp-icon-full-screen')).toBeInTheDocument();
    controls.setAttribute('isfullscreen', 'true');
    (controls as any).isFullscreen = true;
    await (controls as any).updateComplete;
    expect(button.querySelector('sp-icon-full-screen-exit')).toBeInTheDocument();
  });

  it('exits fullscreen when already active', async () => {
    const el = document.querySelector<RsvpPlayer>(TAG)!;
    await el.updateComplete;
    const request = jest.fn();
    const exit = jest.fn();
    (el as any).requestFullscreen = request;
    (document as any).exitFullscreen = exit;
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => el });
    const controls = el.shadowRoot!.querySelector(CONTROLS_TAG) as HTMLElement;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector(FS_SELECTOR) as HTMLButtonElement;
    fireEvent.click(button);
    expect(exit).toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
  });

  it('requests fullscreen when inactive', async () => {
    const el = document.querySelector<RsvpPlayer>(TAG)!;
    await el.updateComplete;
    const request = jest.fn();
    const exit = jest.fn();
    (el as any).requestFullscreen = request;
    (document as any).exitFullscreen = exit;
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
    const controls = el.shadowRoot!.querySelector(CONTROLS_TAG) as HTMLElement;
    await (controls as any).updateComplete;
    const button = controls.shadowRoot!.querySelector(FS_SELECTOR) as HTMLButtonElement;
    fireEvent.click(button);
    expect(request).toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });
});
