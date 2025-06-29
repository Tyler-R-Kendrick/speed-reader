import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import './rsvp-settings';
import './rsvp-controls';
import './rsvp-fullscreen';
import { Token, parseText } from '../parsers/tokenizer';
import { parseSession, serializeSession } from '../parsers/session';

interface Keybindings {
  playPause: string;
  increaseSpeed: string;
  decreaseSpeed: string;
  rewind: string;
  fastForward: string;
}

interface GestureSettings {
  swipe: boolean;
  taps: boolean;
  settingsSwipe: boolean;
}


function formatToken(token: Token): string {
  const closingMap: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'",
  };
  const prefix = token.scopes.join('');
  const suffix = [...token.scopes]
    .reverse()
    .map(s => closingMap[s] ?? '')
    .join('');
  return `${prefix}${token.text}${suffix}`;
}

export class RsvpPlayer extends LitElement {
  // Expose only external properties; internal state managed via @state
  static properties = {
    text: { type: String },
    session: { type: String },
    wpm: { type: Number },
    playing: { type: Boolean },
    words: { type: Array },
    index: { type: Number },
    showSettingsPane: { type: Boolean },
    keybindings: { type: Object },
    gestures: { type: Object },
  };
  /** Input text for RSVP session */
  @property({ type: String }) text!: string;
  /** Serialized session json */
  @property({ type: String }) session: string = '';
  /** Words per minute speed */
  @property({ type: Number }) wpm!: number;

  /** Playback state */
  @state() private playing: boolean;
  /** Parsed words from text */
  @state() private words: Token[];
  /** Current word index */
  @state() private index: number;
  /** Current sentence index */
  @state() private sentenceIndex: number = 0;
  /** Total sentences */
  @state() private totalSentences: number = 0;
  /** Visibility state for settings pane */
  @state() private showSettingsPane: boolean = false;
  /** Configurable keyboard shortcuts */
  @property({ type: Object }) keybindings: Keybindings = {
    playPause: ' ',
    increaseSpeed: 'ArrowUp',
    decreaseSpeed: 'ArrowDown',
    rewind: 'ArrowLeft',
    fastForward: 'ArrowRight',
  };
  /** Gesture support toggles */
  @property({ type: Object }) gestures: GestureSettings = {
    swipe: true,
    taps: true,
    settingsSwipe: true,
  };

  /** Track Y coordinate for swipe gesture */
  private _touchStartY = 0;

  private _resizeObserver?: ResizeObserver;

  private timerId?: number;
  private static readonly MIN_WPM = 100;
  private static readonly MAX_WPM = 800;
  private static readonly STEP = 50;
  private static readonly REWIND_WORDS = 5;
  private static readonly FAST_FORWARD_WORDS = 5; // Added for fast forward functionality
  private static readonly SWIPE_THRESHOLD = 30;

  private touchStartX: number | null = null;

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
      width: 100%;
    }

    @media (max-width: 600px) {
      :host {
        min-height: 100dvh;
        width: 100vw;
        margin: 0;
      }
    }

    .word {
      font-weight: bold;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-size: var(--auto-font-size, 3rem);
      min-height: calc(var(--auto-font-size, 3rem) * 1.2);
    }

    .punctuation {
      font-size: 0.5em;
      margin-top: 0.25em;
    }

    .render-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
    }

    .sentence-progress {
      height: 2px;
      background-color: #FF0000;
      width: 100%;
      pointer-events: none;
      margin-top: 0.25em;
      transition: width 0.1s linear;
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

    .sentence-counter {
      color: #FFFFFF;
      font-size: 0.8rem;
      margin-bottom: 4px;
    }
  `;

  constructor() {
    super();
    // Initialize reactive state properties
    this.playing = false;
    this.words = [];
    this.index = 0;
    this.sentenceIndex = 0;
    this.totalSentences = 0;
    this.showSettingsPane = false;
  }

  private _handleFullscreenChange = () => {
    this.requestUpdate(); // Ensure UI updates when fullscreen state changes
  }

  private _onSettingsPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') {
      this._touchStartY = e.clientY;
    }
  };

  private _onSettingsPointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'touch' && this.gestures.settingsSwipe) {
      const deltaY = this._touchStartY - e.clientY;
      if (deltaY > 50 && !this.showSettingsPane) {
        e.preventDefault();
        this._toggleSettingsPane();
      }
    }
  };

  private _onSettingsTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0] ?? e.changedTouches[0];
    if (touch) {
      this._touchStartY = touch.clientY;
    }
  };

  private _onSettingsTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0] ?? e.touches[0];
    if (!touch) {
      return;
    }
    const deltaY = this._touchStartY - touch.clientY;
    if (this.gestures.settingsSwipe && deltaY > 50 && !this.showSettingsPane) {
      e.preventDefault();
      this._toggleSettingsPane();
    }
  };

  render() {
    const isEnded = !this.playing && this.words.length > 0 && this.index === this.words.length - 1;
    // Play/pause icon and label logic is now primarily within rsvp-controls
    // Replay logic might need to be passed or handled differently if rsvp-controls doesn't support it directly.

    const progressPercent = this.words.length > 0 ? ((this.index + 1) / this.words.length) * 100 : 0;
    const sentenceProgressPercent = this._sentenceProgress();

    return html`
      ${this.showSettingsPane ? html`
        <rsvp-settings
          .text=${this.text}
          .keybindings=${this.keybindings}
          .gestures=${this.gestures}
          @text-change=${(e: CustomEvent) => this.text = e.detail}
          @keybindings-change=${(e: CustomEvent<Keybindings>) => this.keybindings = e.detail}
          @gestures-change=${(e: CustomEvent<GestureSettings>) => this.gestures = e.detail}
          @close=${this._toggleSettingsPane}
        ></rsvp-settings>
      ` : html`
        <div
          class="word"
          part="word"
          @click=${this._onAreaClick}
          @touchstart=${this._onTouchStart}
          @touchmove=${this._onTouchMove}
          @touchend=${this._onTouchEnd}
        >
          ${this.words.length > 0 ? html`
            <div class="render-area">
              <span>${formatToken(this.words[this.index])}</span>
              <div class="sentence-progress" style="width: ${sentenceProgressPercent}%;" aria-hidden="true"></div>
              ${this.words[this.index].markers.length > 0
                ? html`<span class="punctuation">${this.words[this.index].markers.join('')}</span>`
                : ''}
            </div>
          ` : 'Loading...'}
        </div>

        <div class="progress-bar-container" @click=${this._onProgressBarClick}>
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        ${this.totalSentences > 0
          ? html`<div class="sentence-counter">${this.sentenceIndex}/${this.totalSentences}</div>`
          : ''}

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


  private _onPlayPause() {
    const isEnded = !this.playing && this.words.length > 0 && this.index === this.words.length - 1;

    if (isEnded) {
      this.index = 0;
      this.playing = true;
      this._updateSentenceIndex();
    } else {
      this.playing = !this.playing;
    }
    // Dispatch event after state change, so listeners get the new state
    this.dispatchEvent(new CustomEvent(this.playing ? 'play' : 'pause'));
  }

  private _onAreaClick() {
    if (this.gestures.taps) {
      this._onPlayPause();
    }
  }

  private _onTouchStart(e: TouchEvent) {
    if (!this.gestures.swipe && !this.gestures.taps) {
      return;
    }
    this.touchStartX = e.changedTouches[0].clientX;
    e.preventDefault();
  }

  private _onTouchMove(e: TouchEvent) {
    if (this.gestures.swipe || this.gestures.taps) {
      e.preventDefault();
    }
  }

  private _onTouchEnd(e: TouchEvent) {
    if (this.touchStartX === null) {
      return;
    }
    const endX = e.changedTouches[0].clientX;
    const diff = endX - this.touchStartX;
    this.touchStartX = null;
    e.preventDefault();
    if (this.gestures.swipe && Math.abs(diff) > RsvpPlayer.SWIPE_THRESHOLD) {
      if (diff < 0) {
        this._rewind();
      } else {
        this._fastForward();
      }
      return;
    }

    const width = this.clientWidth;
    if (this.gestures.taps) {
      if (endX < width * 0.3) {
        this._decreaseSpeed();
      } else if (endX > width * 0.7) {
        this._increaseSpeed();
      } else {
        this._onPlayPause();
      }
    }
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
    this._updateSentenceIndex();
  }

  private _cachedSentenceStart = -1;
  private _cachedSentenceEnd = -1;
  private _cachedFontSize = 0;
  private _cachedWidth = 0;
  private _cachedHeight = 0;

  private _measureFontSize(start: number, end: number, rect: DOMRect): number {
    const measure = document.createElement('span');
    measure.style.position = 'absolute';
    measure.style.visibility = 'hidden';
    measure.style.whiteSpace = 'nowrap';
    measure.style.fontWeight = 'bold';
    document.body.append(measure);

    const maxWidth = rect.width * 0.9;
    let maxSize = 0;
    for (let i = start; i <= end; i++) {
      const text = formatToken(this.words[i]);
      let fontSize = rect.height * 0.5;
      measure.textContent = text;
      measure.style.fontSize = `${fontSize}px`;
      const width = measure.getBoundingClientRect().width;
      if (width > maxWidth) {
        fontSize *= maxWidth / width;
      }
      if (fontSize > maxSize) {
        maxSize = fontSize;
      }
    }
    measure.remove();
    return maxSize;
  }

  private _updateFontSize() {
    const rect = this.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || this.words.length === 0) {
      return;
    }

    const { start, end } = this._currentSentenceBounds();
    const needsUpdate =
      this._cachedSentenceStart !== start ||
      this._cachedSentenceEnd !== end ||
      this._cachedWidth !== rect.width ||
      this._cachedHeight !== rect.height;

    if (needsUpdate) {
      this._cachedSentenceStart = start;
      this._cachedSentenceEnd = end;
      this._cachedWidth = rect.width;
      this._cachedHeight = rect.height;
      this._cachedFontSize = this._measureFontSize(start, end, rect);
    }

    this.style.setProperty('--auto-font-size', `${this._cachedFontSize}px`);
  }

  /** Keyboard shortcuts: Space, Arrows, F */
  connectedCallback() {
    super.connectedCallback(); // Call super first

    // Set default values for properties if they haven't been set by attributes
    if (this.text === undefined) {
      this.text = '';
    }
    if (this.session === undefined) {
      this.session = '';
    }
    if (this.wpm === undefined) {
      this.wpm = 300;
    }

    window.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('fullscreenchange', this._handleFullscreenChange);
    this.addEventListener('pointerdown', this._onSettingsPointerDown);
    this.addEventListener('pointerup', this._onSettingsPointerUp);
    this.addEventListener('touchstart', this._onSettingsTouchStart, { passive: false });
    this.addEventListener('touchend', this._onSettingsTouchEnd, { passive: false });

    this._resizeObserver = new ResizeObserver(() => {
      this._updateFontSize();
    });
    this._resizeObserver.observe(this);
    this._updateFontSize();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('fullscreenchange', this._handleFullscreenChange);
    this.removeEventListener('pointerdown', this._onSettingsPointerDown);
    this.removeEventListener('pointerup', this._onSettingsPointerUp);
    this.removeEventListener('touchstart', this._onSettingsTouchStart);
    this.removeEventListener('touchend', this._onSettingsTouchEnd);
    this._clearTimer();
    this._resizeObserver?.disconnect();
  }

  protected updated(changed: Map<string, any>) {
    if (changed.has('text') || changed.has('session')) {
      this._resetSession();
    }
    if (changed.has('playing')) {
      this.playing ? this._startTimer() : this._clearTimer();
    }
    if (changed.has('wpm') && this.playing) {
      this._startTimer();
    }
    if (changed.has('index') || changed.has('text') || changed.has('session')) {
      this._updateFontSize();
    }
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case this.keybindings.playPause:
        e.preventDefault();
        this._onPlayPause();
        break;
      case this.keybindings.increaseSpeed:
        this._increaseSpeed();
        break;
      case this.keybindings.decreaseSpeed:
        this._decreaseSpeed();
        break;
      case this.keybindings.rewind:
        this._stepBackward();
        break;
      case this.keybindings.fastForward:
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
    this._updateSentenceIndex();
  }

  private _fastForward() {
    if (this.words.length > 0) {
      this.index = Math.min(this.words.length - 1, this.index + RsvpPlayer.FAST_FORWARD_WORDS);
      this._updateSentenceIndex();
    }
  }

  private _stepBackward() {
    this.index = Math.max(0, this.index - 1);
    this._updateSentenceIndex();
  }

  private _stepForward() {
    if (this.words.length > 0) {
      this.index = Math.min(this.words.length - 1, this.index + 1);
      this._updateSentenceIndex();
    }
  }

  private _resetSession() {
    if (this.session) {
      this.words = parseSession(this.session);
    } else {
      this.words = this.text.trim() ? parseText(this.text.trim()) : [];
    }
    this.index = 0;
    this.totalSentences = this.words.filter(t => t.sentenceEnd).length;
    this.sentenceIndex = this.totalSentences > 0 ? 1 : 0;
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

  private _currentSentenceBounds() {
    let start = 0;
    for (let i = this.index; i > 0; i--) {
      if (this.words[i - 1].sentenceEnd) {
        start = i;
        break;
      }
    }

    let end = this.words.length - 1;
    for (let i = this.index; i < this.words.length; i++) {
      end = i;
      if (this.words[i].sentenceEnd) {
        break;
      }
    }

    return { start, end };
  }

  private _sentenceProgress() {
    if (this.words.length === 0) {
      return 0;
    }
    const { start, end } = this._currentSentenceBounds();
    const total = end - start;
    if (total <= 0) {
      return 0;
    }
    return ((total - (this.index - start)) / total) * 100;
  }

  private _updateSentenceIndex() {
    if (this.totalSentences === 0) {
      this.sentenceIndex = 0;
      return;
    }
    let count = 0;
    for (let i = 0; i < this.index && i < this.words.length; i++) {
      if (this.words[i].sentenceEnd) {
        count++;
      }
    }
    this.sentenceIndex = Math.min(count + 1, this.totalSentences);
  }

  private _nextWord() {
    const token = this.words[this.index];
    if (token && token.extraPause > 0) {
      token.extraPause--;
      return;
    }

    if (this.index < this.words.length - 1) {
      this.index++;
      this._updateSentenceIndex();
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
    this.session = serializeSession(parseText(this.text));
  }

  private _onWpmInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.wpm = parseInt(target.value, 10);
  }


  private _onSettingsSave() {
    this.showSettingsPane = false;
  }
}

customElements.define('rsvp-player', RsvpPlayer);