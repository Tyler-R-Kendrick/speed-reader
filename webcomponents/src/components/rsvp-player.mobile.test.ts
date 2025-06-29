/* eslint-disable max-lines-per-function */
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { fireEvent, within } from '@testing-library/dom';
import { RsvpPlayer } from './rsvp-player';
import { parseText } from '../parsers/tokenizer';
import { serializeSession } from '../parsers/session';

describe('RsvpPlayer mobile layout', () => {
  it('includes mobile fullscreen styles', () => {
    const css = Array.isArray(RsvpPlayer.styles) ? RsvpPlayer.styles.map(s => s.cssText).join('') : RsvpPlayer.styles.cssText;
    expect(css).toMatch(/@media\s*\(max-width: 600px\)/);
    expect(css).toMatch(/min-height:\s*100dvh/);
    expect(css).toMatch(/width:\s*100vw/);
  });

  describe('touch gestures', () => {
    const TAG = 'rsvp-player';

    beforeEach(() => {
      if (!customElements.get(TAG)) {
        customElements.define(TAG, RsvpPlayer);
      }
      document.body.innerHTML = `<${TAG}></${TAG}>`;
    });

    it('toggles play/pause when tapping word area', async () => {
      const el = document.querySelector<RsvpPlayer>(TAG)!;
      await el.updateComplete;
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 100 });
      const word = el.shadowRoot!.querySelector('.word') as HTMLElement;

      fireEvent.click(word);
      await el.updateComplete;
      expect((el as any).playing).toBe(true);

      fireEvent.click(word);
      await el.updateComplete;
      expect((el as any).playing).toBe(false);
    });

    it('increases speed on right tap and decreases on left tap', async () => {
      const el = document.querySelector<RsvpPlayer>(TAG)!;
      await el.updateComplete;
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 100 });
      const word = el.shadowRoot!.querySelector('.word') as HTMLElement;

      fireEvent.touchStart(word, { changedTouches: [{ clientX: 80 }] });
      fireEvent.touchEnd(word, { changedTouches: [{ clientX: 80 }] });
      await el.updateComplete;
      expect(el.wpm).toBe(350);

      fireEvent.touchStart(word, { changedTouches: [{ clientX: 10 }] });
      fireEvent.touchEnd(word, { changedTouches: [{ clientX: 10 }] });
      await el.updateComplete;
      expect(el.wpm).toBe(300);
    });

    it('rewinds and fast-forwards on swipe', async () => {
      const el = document.querySelector<RsvpPlayer>(TAG)!;
      el.session = serializeSession(parseText('one two three four five six seven eight nine ten'));
      await el.updateComplete;
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 100 });
      (el as any).index = 5;
      const word = el.shadowRoot!.querySelector('.word') as HTMLElement;

      fireEvent.touchStart(word, { changedTouches: [{ clientX: 60 }] });
      fireEvent.touchEnd(word, { changedTouches: [{ clientX: 10 }] });
      await el.updateComplete;
      expect((el as any).index).toBe(0);

      (el as any).index = 2;
      fireEvent.touchStart(word, { changedTouches: [{ clientX: 10 }] });
      fireEvent.touchEnd(word, { changedTouches: [{ clientX: 90 }] });
      await el.updateComplete;
      expect((el as any).index).toBe(7);
    });

    it('prevents default browser swipe navigation', async () => {
      const el = document.querySelector<RsvpPlayer>(TAG)!;
      await el.updateComplete;
      const word = el.shadowRoot!.querySelector('.word') as HTMLElement;
      const ev = new TouchEvent('touchstart', { cancelable: true, changedTouches: [ { clientX: 50 } ] } as any);
      const prevent = jest.spyOn(ev, 'preventDefault');
      word.dispatchEvent(ev);
      expect(prevent).toHaveBeenCalled();
    });

    it('ignores swipe gestures when disabled', async () => {
      const el = document.querySelector<RsvpPlayer>(TAG)!;
      el.gestures = { ...el.gestures, swipe: false };
      el.session = serializeSession(parseText('one two three four five'));
      await el.updateComplete;
      const word = el.shadowRoot!.querySelector('.word') as HTMLElement;
      (el as any).index = 2;
      fireEvent.touchStart(word, { changedTouches: [{ clientX: 60 }] });
      fireEvent.touchEnd(word, { changedTouches: [{ clientX: 10 }] });
      await el.updateComplete;
      expect((el as any).index).toBe(2);
    });
  });
});
