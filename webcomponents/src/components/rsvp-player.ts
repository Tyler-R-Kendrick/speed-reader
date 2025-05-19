import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export class RsvpPlayer extends LitElement {
  static properties = {
    text: { type: String },
    wpm: { type: Number },
    playing: { type: Boolean },
    words: { type: Array },
    index: { type: Number },
  };
  /** Input text for RSVP session */
  @property({ type: String }) text!: string;
  /** Words per minute speed */
  @property({ type: Number }) wpm!: number;
  /** Playback state */
  @state private playing: boolean = false;
  /** Parsed words from text */
  @state private words: string[] = [];
  /** Current word index */
  @state private index: number = 0;
  private timerId?: number;
  private static readonly MIN_WPM = 200;
  private static readonly MAX_WPM = 350;
  private static readonly STEP = 50;
  private static readonly REWIND_WORDS = 5;

  static styles = css`
    :host {
      display: block;
      text-align: center;
    }
    .word {
      font-size: 2rem;
    }
  `;

  constructor() {
    super();
    // @state properties (playing, words, index) are now initialized at their declaration.
    // Do NOT initialize @property fields (text, wpm) here.
    // They will be initialized from attributes or in connectedCallback for defaults.
  }

  render() {
    return html`
      <div class="controls">
        <button @click=${this._onPlayPause}>
          ${this.playing ? 'Pause' : 'Play'}
        </button>
        <span class="wpm">${this.wpm} WPM</span>
      </div>
      <div class="word" part="word">
        ${this.words.length > 0 ? this.words[this.index] : ''}
      </div>
    `;
  }

  private _onPlayPause() {
    this.playing = !this.playing;
    this.dispatchEvent(new CustomEvent(this.playing ? 'play' : 'pause'));
  }
  
  /** Keyboard shortcuts: Space, Arrows, F */
  connectedCallback() {
    super.connectedCallback(); // Call super first

    // Set default values for properties if they haven't been set by attributes
    if (this.text === undefined) {
      this.text = '';
    }
    if (this.wpm === undefined) {
      this.wpm = 300;
    }

    window.addEventListener('keydown', this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
    this._clearTimer();
  }

  protected updated(changed: Map<string, any>) {
    if (changed.has('text')) {
      this._resetSession();
    }
    if (changed.has('playing')) {
      this.playing ? this._startTimer() : this._clearTimer();
    }
    if (changed.has('wpm') && this.playing) {
      this._startTimer();
    }
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case ' ': // space
        e.preventDefault();
        this._onPlayPause();
        break;
      case 'ArrowUp':
        this._increaseSpeed();
        break;
      case 'ArrowDown':
        this._decreaseSpeed();
        break;
      case 'ArrowLeft':
        this._rewind();
        break;
      case 'f':
      case 'F':
        this._toggleFullscreen();
        break;
    }
  };

  private _increaseSpeed() {
    const next = Math.min(this.wpm + RsvpPlayer.STEP, RsvpPlayer.MAX_WPM);
    if (next !== this.wpm) {
      this.wpm = next;
    }
  }

  private _decreaseSpeed() {
    const prev = Math.max(this.wpm - RsvpPlayer.STEP, RsvpPlayer.MIN_WPM);
    if (prev !== this.wpm) {
      this.wpm = prev;
    }
  }

  private _rewind() {
    this.index = Math.max(0, this.index - RsvpPlayer.REWIND_WORDS);
  }

  private _resetSession() {
    this.words = this.text.trim() ? this.text.trim().split(/\s+/) : [];
    this.index = 0;
  }

  private _startTimer() {
    this._clearTimer();
    const interval = 60000 / this.wpm;
    this.timerId = window.setInterval(() => this._nextWord(), interval);
  }

  private _clearTimer() {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private _nextWord() {
    if (this.index < this.words.length - 1) {
      this.index++;
    } else {
      this.playing = false;
      this._clearTimer();
      this.dispatchEvent(new CustomEvent('end'));
    }
  }

  private _toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}

customElements.define('rsvp-player', RsvpPlayer);