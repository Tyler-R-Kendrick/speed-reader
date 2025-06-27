import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { RsvpPlayer } from './rsvp-player';
import './rsvp-controls';

const ENTER_PATH =
  'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z';
const EXIT_PATH =
  'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z';
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
    const path = button.querySelector('path')!;
    expect(path).toHaveAttribute('d', ENTER_PATH);
    controls.setAttribute('isfullscreen', 'true');
    (controls as any).isFullscreen = true;
    await (controls as any).updateComplete;
    const newPath = button.querySelector('path')!;
    expect(newPath).toHaveAttribute('d', EXIT_PATH);
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
