import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
import './rsvp-settings';
import type { RsvpSettings } from './rsvp-settings';

const TAG = 'rsvp-settings';
const TEST_URL = 'http://example.com';

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
    el.url = TEST_URL;
    await el.updateComplete;
    const loadButton = el.shadowRoot!.querySelector('.load-url') as HTMLButtonElement;
    const listener = jest.fn();
    el.addEventListener('text-change', listener);
    fireEvent.click(loadButton);
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledWith(TEST_URL);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Hello World' }));
  });

  it('disables textarea when url is set', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    el.url = TEST_URL;
    await el.updateComplete;
    const textarea = el.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('readonly');
  });
});
