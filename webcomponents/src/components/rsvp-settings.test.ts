/* eslint-disable max-lines-per-function */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';
class Dummy extends HTMLElement {}
if (!customElements.get('sp-tabs')) customElements.define('sp-tabs', Dummy);
if (!customElements.get('sp-tab')) customElements.define('sp-tab', Dummy);

import './rsvp-settings';
import type { RsvpSettings } from './rsvp-settings';

const TAG = 'rsvp-settings';
const TEST_URL = 'http://example.com';
const CHANGE_EVENT = "text-change";
const TEXTFIELD_SELECTOR = 'sp-textfield#text-input';
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('RsvpSettings', () => {
  beforeEach(() => {
    document.body.innerHTML = `<${TAG}></${TAG}>`;
  });

  it('shows paste text area by default', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(TEXTFIELD_SELECTOR)).toBeInTheDocument();
  });

  it('switches to url input', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    el.mode = 'url';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('#url-input')).toBeInTheDocument();
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
    fireEvent.click(loadButton);
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledWith(TEST_URL);
  });

  it('hides textarea when in url mode', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    el.mode = 'url';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(TEXTFIELD_SELECTOR)).toBeNull();
    expect(el.shadowRoot!.querySelector('#url-input')).toBeInTheDocument();
  });

  it('enables textarea after switching back to paste mode', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    el.url = TEST_URL;
    el.mode = 'url';
    await el.updateComplete;
    el.mode = 'paste';
    await el.updateComplete;
    const field = el.shadowRoot!.querySelector(TEXTFIELD_SELECTOR) as HTMLElement;
    expect(field).not.toHaveAttribute('readonly');
  });

  it('imports text from file', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['<p>Hello File</p>'], 'sample.html', { type: 'text/html' });

    jest.spyOn(window as any, 'FileReader').mockRestore?.();
    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);
    await el.updateComplete;
    await flush();
    await flush();
    const field = el.shadowRoot!.querySelector(TEXTFIELD_SELECTOR) as any;
    expect(field.value).toBe('Hello File');
  });


  it('disables summary toggle without api key', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    await el.updateComplete;
    const toggle = el.shadowRoot!.querySelector('#llm-summary') as HTMLInputElement;
    expect(toggle.disabled).toBe(true);
  });

  it('summarizes url content when enabled', async () => {
    const el = document.querySelector(TAG) as RsvpSettings;
    el.mode = 'url';
    el.url = TEST_URL;
    el.llmConfig = { provider: 'openrouter', apiKey: 'k', model: 'gpt' } as any;
    el.useLlmSummary = true;
    await el.updateComplete;
    const fetchMock: any = jest.fn();
    fetchMock.mockResolvedValueOnce({ text: async () => '<html><body>Original</body></html>' } as any);
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ message: { content: 'Summary' } }] }) } as any);
    (global as any).fetch = fetchMock;
    await (el as any)._loadUrl();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
