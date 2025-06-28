/* eslint-disable max-lines-per-function, sonarjs/no-duplicate-string */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import './rsvp-settings';
import type { RsvpSettings } from './rsvp-settings';

const TAG = 'rsvp-settings';

describe('RsvpSettings', () => {
  beforeEach(() => {
    document.body.innerHTML = `<${TAG}></${TAG}>`;
  });

  it('shows paste text area by default', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('textarea')).toBeInTheDocument();
  });

  it('switches to url input', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    const buttons = el.shadowRoot!.querySelectorAll('.tabs button');
    fireEvent.click(buttons[1]!);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input[type="url"]')).toBeInTheDocument();
  });

  it('loads content from url', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    el.mode = 'url';
    await el.updateComplete;
    const fetchMock = jest.fn(() => Promise.resolve({
      text: async () => '<html><body>Hello World</body></html>'
    }));
    (global as any).fetch = fetchMock;
    el.url = 'http://example.com';
    await el.updateComplete;
    const loadButton = el.shadowRoot!.querySelector('.load-url') as HTMLButtonElement;
    const listener = jest.fn();
    el.addEventListener('text-change', listener);
    fireEvent.click(loadButton);
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledWith('http://example.com');
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Hello World' }));
  });

  it('emits close event when _onClose called', () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    const listener = jest.fn();
    el.addEventListener('close', listener);
    (el as any)._onClose();
    expect(listener).toHaveBeenCalled();
  });

  it('emits close event on simulated swipe down', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    (el as any)._touchStartY = 100;
    const listener = jest.fn();
    el.addEventListener('close', listener);
    (el as any)._onPointerUp({ pointerType: 'touch', clientY: 170, preventDefault() {} } as PointerEvent);
    expect(listener).toHaveBeenCalled();
  });

  it('updates aria-selected on tab change', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    const tabs = el.shadowRoot!.querySelectorAll('nav[role="tablist"] button');
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    fireEvent.click(tabs[1]!);
    await el.updateComplete;
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('false');
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
  });
});
