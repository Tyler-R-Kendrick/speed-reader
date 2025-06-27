import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import './rsvp-settings';
import './rsvp-controls';
import './rsvp-fullscreen';

export class RsvpPlayer extends LitElement {
  // Expose only external properties; internal state managed via @state
  static properties = {
    text: { type: String },
    wpm: { type: Number },
    wordFontSize: { type: Number }, // Added for word font size configuration
    playing: { type: Boolean },
    words: { type: Array },
    index: { type: Number },
    showSettingsPane: { type: Boolean },
  };
  /** Input text for RSVP session */
  @property({ type: String }) text!: string;
  /** Words per minute speed */
  @property({ type: Number }) wpm!: number;
  /** Word font size in rem */
  @property({ type: Number }) wordFontSize: number = 3; // Default font size in rem

  /** Playback state */
  @state() private playing: boolean;
  /** Parsed words from text */
  @state() private words: string[];
  /** Current word index */
  @state() private index: number;
  /** Visibility state for settings pane */
  @state() private showSettingsPane: boolean = false;

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
      position: relative; /* Needed for settings pane positioning */
    }

    .word {
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
    // Initialize reactive state properties
    this.playing = false;
    this.words = [];
    this.index = 0;
    this.showSettingsPane = false;
  }

  private _handleFullscreenChange = () => {
    this.requestUpdate(); // Ensure UI updates when fullscreen state changes
  }

  render() {
    const isEnded = !this.playing && this.words.length > 0 && this.index === this.words.length - 1;
    // Play/pause icon and label logic is now primarily within rsvp-controls
    // Replay logic might need to be passed or handled differently if rsvp-controls doesn't support it directly.

    const progressPercent = this.words.length > 0 ? ((this.index + 1) / this.words.length) * 100 : 0;

    return html`
      ${this.showSettingsPane ? html`
        <rsvp-settings
          .text=${this.text}
          .wordFontSize=${this.wordFontSize}
          @text-change=${(e: CustomEvent) => this.text = e.detail}
          @font-size-change=${(e: CustomEvent) => this.wordFontSize = e.detail}
          @close=${this._toggleSettingsPane}
        ></rsvp-settings>
      ` : html`
        <div class="word" part="word" style="font-size: ${this.wordFontSize}rem;">
          ${this.words.length > 0 ? this.words[this.index] : 'Loading...'}
        </div>

        <div class="progress-bar-container" @click=${this._onProgressBarClick}>
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>

        <rsvp-controls
          .playing=${this.playing}
          .wpm=${this.wpm}
          .isEnded=${isEnded} 
          .isFullscreen=${document.fullscreenElement === this}
          @play-pause=${this._onPlayPause}
          @rewind=${this._rewind}
          @fast-forward=${this._fastForward}
          @decrease-speed=${this._decreaseSpeed}
          @increase-speed=${this._increaseSpeed}
          @toggle-fullscreen=${this._toggleFullscreen}
          @toggle-settings=${this._toggleSettingsPane}
        ></rsvp-controls>
      `}
    `;
  }

  private _toggleSettingsPane() {
    this.showSettingsPane = !this.showSettingsPane;
  }

  private _handleTextInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.text = textarea.value;
  }

  private _handleFontSizeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.wordFontSize = parseFloat(input.value);
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

  private _onTextInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.text = target.value;
  }

  private _onWpmInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.wpm = parseInt(target.value, 10);
  }

  private _onFontSizeInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.wordFontSize = parseFloat(target.value);
  }

  private _onSettingsSave() {
    this.showSettingsPane = false;
  }
}

customElements.define('rsvp-player', RsvpPlayer);