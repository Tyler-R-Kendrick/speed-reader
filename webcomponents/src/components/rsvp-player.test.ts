import { RsvpPlayer } from './rsvp-player';

if (!customElements.get('rsvp-player')) {
  customElements.define('rsvp-player', RsvpPlayer);
}

describe('RsvpPlayer basic behavior', () => {
  let el: RsvpPlayer;
  beforeEach(() => {
    el = document.createElement('rsvp-player') as RsvpPlayer;
    document.body.appendChild(el);
    el.connectedCallback();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes wpm to 300', () => {
    expect(el.wpm).toBe(300);
  });

  it('increase and decrease speed limits respect min/max', () => {
    (el as any)._increaseSpeed();
    expect(el.wpm).toBe(350);
    (el as any)._increaseSpeed();
    expect(el.wpm).toBe(350);
    (el as any)._decreaseSpeed();
    expect(el.wpm).toBe(300);
  });

  it('reset session splits text into words', () => {
    el.text = 'hello world';
    (el as any)._resetSession();
    expect((el as any).words).toEqual(['hello', 'world']);
    expect((el as any).index).toBe(0);
  });
});
