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
  private static readonly FAST_FORWARD_WORDS = 5; // Added for fast forward functionality

  static styles = css`
    :host {
      display: block;
      text-align: center;
      background-color: #000000; /* mediaPlayer.background.color.default */
      color: #FFFFFF; /* mediaPlayer.text.color.default */
      padding: 16px;
      font-family: sans-serif;
      min-height: 200px; /* Ensure a minimum height */
      display: flex;
      flex-direction: column;
      justify-content: center; /* Center word vertically */
    }

    .word {
      font-size: 3rem; /* Increased for better visibility */
      font-weight: bold;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .controls {
      background-color: rgba(0, 0, 0, 0.8); /* mediaPlayer.controls.background.color.default */
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px; /* Added for softer corners */
      margin-top: 16px; /* Space between word and controls */
    }

    .controls button {
      background-color: transparent; /* mediaPlayer.controls.button.background.color.default */
      color: #FFFFFF; /* mediaPlayer.controls.icon.color.default */
      border: none;
      padding: 8px 12px; /* mediaPlayer.controls.button.padding.value (adjusted for better feel) */
      cursor: pointer;
      font-size: 1rem; /* Adjusted for button text/icons */
      border-radius: 4px; /* Added for softer button corners */
    }

    .controls button:hover {
      color: #CCCCCC; /* mediaPlayer.controls.icon.color.hover */
      background-color: rgba(255, 255, 255, 0.1); /* Subtle hover effect */
    }

    .wpm {
      color: #FFFFFF; /* mediaPlayer.text.color.default */
      font-size: 14px; /* mediaPlayer.text.fontSize.default */
      margin: 0 10px;
    }

    .control-group {
      display: flex;
      align-items: center;
    }

    .progress-bar-container {
      width: 100%;
      height: 8px; /* Adjusted for better visibility, can use token mediaPlayer.progressBar.height.value */
      background-color: rgba(255, 255, 255, 0.3); /* mediaPlayer.progressBar.background.color.default */
      border-radius: 4px;
      margin: 10px 0;
      cursor: pointer; /* Indicate it will be interactive */
    }

    .progress-bar {
      height: 100%;
      background-color: #FF0000; /* mediaPlayer.progressBar.played.color.default */
      border-radius: 4px;
      width: 0%; /* Initial width */
      transition: width 0.1s linear;
    }
  `;

  constructor() {
    super();
    // @state properties (playing, words, index) are now initialized at their declaration.
    // Do NOT initialize @property fields (text, wpm) here.
    // They will be initialized from attributes or in connectedCallback for defaults.
  }

  private _handleFullscreenChange = () => {
    this.requestUpdate(); // Ensure UI updates when fullscreen state changes
  }

  render() {
    const isEnded = !this.playing && this.words.length > 0 && this.index === this.words.length - 1;
    let playPauseIcon;
    let playPauseLabel;

    if (isEnded) {
      playPauseIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>`;
      playPauseLabel = "Replay";
    } else if (this.playing) {
      playPauseIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      playPauseLabel = "Pause";
    } else {
      playPauseIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      playPauseLabel = "Play";
    }

    // Standard Material Design Icons paths
    const enterFullscreenPath = "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-2-4h2V7h-3V5h5v5z";
    const exitFullscreenPath = "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z";

    const progressPercent = this.words.length > 0 ? ((this.index + 1) / this.words.length) * 100 : 0;

    return html`
      <div class="word" part="word">
        ${this.words.length > 0 ? this.words[this.index] : 'Loading...'}
      </div>

      <div class="progress-bar-container" @click=${this._onProgressBarClick}>
        <div class="progress-bar" style="width: ${progressPercent}%;"></div>
      </div>

      <div class="controls">
        <div class="control-group">
          <button @click=${this._onPlayPause} aria-label=${playPauseLabel}>
            ${playPauseIcon}
          </button>
          <button @click=${this._rewind} aria-label="Rewind">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
          </button>
          <button @click=${this._fastForward} aria-label="Fast Forward">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m4 18 8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
          </button>
        </div>
        <span class="wpm">${this.wpm} WPM</span>
        <div class="control-group">
          <button @click=${this._decreaseSpeed} aria-label="Decrease speed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
          </button>
          <button @click=${this._increaseSpeed} aria-label="Increase speed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button @click=${this._toggleFullscreen} aria-label="Toggle Fullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              ${document.fullscreenElement === this ?
                html`<path d="${exitFullscreenPath}"/>` :
                html`<path d="${enterFullscreenPath}"/>`
              }
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  private _onPlayPause() {
    const isEnded = !this.playing && this.words.length > 0 && this.index === this.words.length - 1;

    if (isEnded) {
      this.index = 0;
      this.playing = true;
    } else {
      this.playing = !this.playing;
    }
    // Dispatch event after state change, so listeners get the new state
    this.dispatchEvent(new CustomEvent(this.playing ? 'play' : 'pause'));
  }
  
  private _onProgressBarClick(e: MouseEvent) {
    if (this.words.length === 0) return;

    const progressBarContainer = this.shadowRoot?.querySelector('.progress-bar-container');
    if (!progressBarContainer) return;

    const rect = progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const progress = Math.max(0, Math.min(1, clickX / width));
    
    this.index = Math.floor(progress * this.words.length);
    // Ensure index doesn't exceed bounds if click is exactly at the end
    if (this.index === this.words.length) {
        this.index = this.words.length - 1;
    }
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
    this.addEventListener('fullscreenchange', this._handleFullscreenChange);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
    this.removeEventListener('fullscreenchange', this._handleFullscreenChange);
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
        this._stepBackward();
        break;
      case 'ArrowRight':
        this._stepForward();
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

  private _fastForward() {
    if (this.words.length > 0) {
      this.index = Math.min(this.words.length - 1, this.index + RsvpPlayer.FAST_FORWARD_WORDS);
    }
  }

  private _stepBackward() {
    this.index = Math.max(0, this.index - 1);
  }

  private _stepForward() {
    if (this.words.length > 0) {
      this.index = Math.min(this.words.length - 1, this.index + 1);
    }
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
    if (document.fullscreenElement === this) {
      document.exitFullscreen();
    } else {
      this.requestFullscreen();
    }
  }
}

customElements.define('rsvp-player', RsvpPlayer);