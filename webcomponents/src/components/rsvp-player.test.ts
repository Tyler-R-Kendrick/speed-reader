import '@testing-library/jest-dom';
import { screen, fireEvent, within } from '@testing-library/dom';
import { RsvpPlayer } from './rsvp-player';

const PLAYER_TAG = 'rsvp-player';

if (!customElements.get(PLAYER_TAG)) {
  customElements.define(PLAYER_TAG, RsvpPlayer);
}

/* eslint-disable max-lines-per-function */
describe.skip('RsvpPlayer', () => {
  beforeEach(() => {
    document.body.innerHTML = `<${PLAYER_TAG}></${PLAYER_TAG}>`;
  });

  it('renders play button', () => {
    const button = screen.getByRole('button', { name: /play/i });
    expect(button).toBeInTheDocument();
  });

  it('displays default wpm', () => {
    const wpm = screen.getByText(/300 WPM/i);
    expect(wpm).toBeInTheDocument();
  });

  it('toggles play/pause on click', async () => {
    const el = document.querySelector<RsvpPlayer>(PLAYER_TAG)!;
    await el.updateComplete;
    const button = within(el.shadowRoot! as unknown as HTMLElement).getByRole('button');
    fireEvent.click(button);
    await el.updateComplete;
    expect(button).toHaveTextContent(/pause/i);
    fireEvent.click(button);
    await el.updateComplete;
    expect(button).toHaveTextContent(/play/i);
  });

  it('toggles play/pause on Space key', async () => {
    const el = document.querySelector<RsvpPlayer>(PLAYER_TAG)!;
    await el.updateComplete;
    const button = within(el.shadowRoot! as unknown as HTMLElement).getByRole('button');
    fireEvent.keyDown(window, { key: ' ' });
    await el.updateComplete;
    expect(button).toHaveTextContent(/pause/i);
    fireEvent.keyDown(window, { key: ' ' });
    await el.updateComplete;
    expect(button).toHaveTextContent(/play/i);
  });

  it('increases speed with ArrowUp key', async () => {
    const el = document.querySelector<RsvpPlayer>(PLAYER_TAG)!;
    await el.updateComplete;
    const display = within(el.shadowRoot! as unknown as HTMLElement).getByText(/\d+ WPM/);
    const initial = el.wpm;
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    await el.updateComplete;
    const newWpm = el.wpm;
    expect(newWpm).toBeGreaterThan(initial);
    expect(newWpm).toBeLessThanOrEqual(800);
    expect(display).toHaveTextContent(`${newWpm} WPM`);
  });

  it('decreases speed with ArrowDown key', async () => {
    const el = document.querySelector<RsvpPlayer>(PLAYER_TAG)!;
    await el.updateComplete;
    const display = within(el.shadowRoot! as unknown as HTMLElement).getByText(/\d+ WPM/);
    const initial = el.wpm;
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    await el.updateComplete;
    const newWpm = el.wpm;
    expect(newWpm).toBeLessThan(initial);
    expect(newWpm).toBeGreaterThanOrEqual(100);
    expect(display).toHaveTextContent(`${newWpm} WPM`);
  });

  it('rewinds words with ArrowLeft key', async () => {
    jest.useFakeTimers();
    const el = document.querySelector<RsvpPlayer>(PLAYER_TAG)!;
    el.text = 'one two three four five six seven eight';
    await el.updateComplete;
    fireEvent.click(within(el.shadowRoot! as unknown as HTMLElement).getByRole('button'));
    await el.updateComplete;
    // Advance 6 words
    jest.advanceTimersByTime((60000 / el.wpm) * 6);
    await el.updateComplete;
    // Should be at index 6 (7th word)
    expect(within(el.shadowRoot! as unknown as HTMLElement).getByText('seven')).toBeInTheDocument();
    // Rewind by 5 words
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await el.updateComplete;
    // Should now display word at index 1 => 'two'
    expect(within(el.shadowRoot! as unknown as HTMLElement).getByText('two')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('displays first word when text is set', async () => {
    const el = document.querySelector<RsvpPlayer>(PLAYER_TAG)!;
    el.text = 'hello world';
    await el.updateComplete;
    expect(within(el.shadowRoot! as unknown as HTMLElement).getByText('hello')).toBeInTheDocument();
  });
});