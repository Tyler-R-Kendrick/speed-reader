import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { HtmlParser } from '../parsers/content-parser';

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

export class RsvpSettings extends LitElement {
  @property({ type: String }) text: string = '';
  @property({ type: Number }) wordFontSize: number = 3;
  @property({ type: String }) mode: 'paste' | 'url' = 'paste';
  @property({ type: String }) url: string = '';
  @property({ type: Object }) keybindings: Keybindings = {
    playPause: ' ',
    increaseSpeed: 'ArrowUp',
    decreaseSpeed: 'ArrowDown',
    rewind: 'ArrowLeft',
    fastForward: 'ArrowRight',
  };
  @property({ type: Object }) gestures: GestureSettings = {
    swipe: true,
    taps: true,
    settingsSwipe: true,
  };

  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 20px;
      z-index: 10;
      overflow-y: auto;
      overscroll-behavior: contain;
      transform: translateY(100%);
      animation: slide-up 0.3s ease-out forwards;
    }

    @keyframes slide-up {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    @media (max-width: 600px) {
      :host {
        padding: 10px;
      }
    }

    .settings-pane div {
      margin-bottom: 15px;
      width: 80%;
      max-width: 400px;
    }

    .tabs {
      display: flex;
      gap: 8px;
      width: 100%;
      max-width: 400px;
    }

    .tabs button {
      flex: 1;
      padding: 8px;
      border: 1px solid #555;
      background-color: #222;
      color: #fff;
      cursor: pointer;
    }

    .tabs button.active {
      background-color: #ff0000;
    }

    .settings-pane label {
      display: block;
      margin-bottom: 5px;
      color: #FFFFFF;
    }

    .settings-pane textarea,
    .settings-pane input[type="number"],
    .settings-pane input[type="range"],
    .settings-pane input[type="url"] {
      width: 100%;
      padding: var(--sr-spacing-sm, 8px);
      border-radius: var(--sr-radius-md, 4px);
      border: 1px solid #555;
      background-color: #333;
      color: #FFFFFF;
      box-sizing: border-box;
    }
    .settings-pane textarea {
      min-height: 40vh;
      max-height: 60vh;
      resize: vertical;
    }
    @media (max-width: 600px) {
      .settings-pane textarea {
        min-height: 30vh;
      }
    }

    .settings-pane button {
      background-color: #FF0000;
      color: #FFFFFF;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 1rem;
      border-radius: 4px;
      margin-top: 10px;
    }
    .settings-pane button:hover {
      background-color: #CC0000;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      color: #FFFFFF;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s, color 0.2s;
    }
    .close-button:hover {
      background-color: #FFFFFF;
      color: #000000;
    }
  `;

  private _onTextInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    this.dispatchEvent(new CustomEvent('text-change', { detail: value }));
  }

  private _onFontSizeInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.dispatchEvent(new CustomEvent('font-size-change', { detail: value }));
  }

  private _onUrlInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.url = target.value;
  }

  private async _loadUrl() {
    if (!this.url) return;
    try {
      const res = await fetch(this.url);
      const text = await res.text();
      const parser = new HtmlParser();
      const parsed = parser.parse(text);
      this.dispatchEvent(
        new CustomEvent('text-change', { detail: parsed })
      );
    } catch {
      // Swallow network errors
    }
  }

  private _onKeybindingInput(action: keyof Keybindings, e: Event) {
    const target = e.target as HTMLInputElement;
    const updated = { ...this.keybindings, [action]: target.value };
    this.keybindings = updated;
    this.dispatchEvent(new CustomEvent('keybindings-change', { detail: updated }));
  }

  private _onGestureToggle(action: keyof GestureSettings, e: Event) {
    const target = e.target as HTMLInputElement;
    const updated = { ...this.gestures, [action]: target.checked };
    this.gestures = updated;
    this.dispatchEvent(new CustomEvent('gestures-change', { detail: updated }));
  }

  private _onClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _touchStartY = 0;
  private _isSwiping = false;

  private _onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch' && this.gestures.settingsSwipe) {
      this._touchStartY = e.clientY;
      this._isSwiping = this.scrollTop === 0;
    }
  };

  private _onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' && this.gestures.settingsSwipe && this._isSwiping) {
      const deltaY = e.clientY - this._touchStartY;
      if (deltaY > 10) {
        e.preventDefault();
      }
    }
  };

  private _onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'touch' && this.gestures.settingsSwipe && this._isSwiping) {
      const deltaY = e.clientY - this._touchStartY;
      if (deltaY > 50) {
        e.preventDefault();
        this._onClose();
      }
    }
    this._isSwiping = false;
  };

  private _onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0] ?? e.changedTouches[0];
    if (touch && this.gestures.settingsSwipe) {
      this._touchStartY = touch.clientY;
      this._isSwiping = this.scrollTop === 0;
    }
  };

  private _onTouchMove = (e: TouchEvent) => {
    if (this.gestures.settingsSwipe && this._isSwiping) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      if (touch && touch.clientY - this._touchStartY > 10) {
        e.preventDefault();
      }
    }
  };

  private _onTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0] ?? e.touches[0];
    if (touch && this.gestures.settingsSwipe && this._isSwiping) {
      const deltaY = touch.clientY - this._touchStartY;
      if (deltaY > 50) {
        e.preventDefault();
        this._onClose();
      }
    }
    this._isSwiping = false;
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerdown', this._onPointerDown);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerup', this._onPointerUp);
    this.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.addEventListener('touchend', this._onTouchEnd, { passive: false });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('pointerdown', this._onPointerDown);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerup', this._onPointerUp);
    this.removeEventListener('touchstart', this._onTouchStart);
    this.removeEventListener('touchmove', this._onTouchMove);
    this.removeEventListener('touchend', this._onTouchEnd);
  }

  render() {
    const pasteActive = this.mode === 'paste';
    return html`
      <div class="settings-pane">
        <button class="close-button" aria-label="Close settings" @click=${this._onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <nav class="tabs" role="tablist">
          <button class=${pasteActive ? 'active' : ''} role="tab" aria-selected=${pasteActive} @click=${() => { this.mode = 'paste'; }}>
            Paste Text
          </button>
          <button class=${pasteActive ? '' : 'active'} role="tab" aria-selected=${!pasteActive} @click=${() => { this.mode = 'url'; }}>
            From URL
          </button>
        </nav>
        ${pasteActive ? html`
          <div>
            <label for="text-input">Text to Display:</label>
            <textarea
              id="text-input"
              .value=${this.text}
              @input=${this._onTextInput}
              ?readonly=${this.mode === 'url'}
              aria-readonly=${this.mode === 'url'}
            ></textarea>
          </div>
        ` : html`
          <div>
            <label for="url-input">URL to Load:</label>
            <input id="url-input" type="url" .value=${this.url} @input=${this._onUrlInput}>
            <button class="load-url" @click=${this._loadUrl}>Load Content</button>
          </div>
        `}
        <div>
          <label for="font-size-input">Font Size (rem): ${this.wordFontSize}</label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="range" id="font-size-input" min="1" max="10" step="0.5" .value=${this.wordFontSize.toString()} @input=${this._onFontSizeInput}>
            <input type="number" id="font-size-number-input" min="1" max="10" step="0.1" .value=${this.wordFontSize.toString()} @input=${this._onFontSizeInput} style="width: 60px;">
          </div>
        </div>
        <fieldset>
          <legend>Keyboard Shortcuts</legend>
          <label>Play/Pause
            <input id="kb-play" type="text" .value=${this.keybindings.playPause} @input=${(e: Event) => this._onKeybindingInput('playPause', e)}>
          </label>
          <label>Increase Speed
            <input id="kb-inc" type="text" .value=${this.keybindings.increaseSpeed} @input=${(e: Event) => this._onKeybindingInput('increaseSpeed', e)}>
          </label>
          <label>Decrease Speed
            <input id="kb-dec" type="text" .value=${this.keybindings.decreaseSpeed} @input=${(e: Event) => this._onKeybindingInput('decreaseSpeed', e)}>
          </label>
          <label>Rewind
            <input id="kb-rew" type="text" .value=${this.keybindings.rewind} @input=${(e: Event) => this._onKeybindingInput('rewind', e)}>
          </label>
          <label>Fast Forward
            <input id="kb-ff" type="text" .value=${this.keybindings.fastForward} @input=${(e: Event) => this._onKeybindingInput('fastForward', e)}>
          </label>
        </fieldset>
        <fieldset>
          <legend>Gestures</legend>
          <label><input type="checkbox" .checked=${this.gestures.swipe} @change=${(e: Event) => this._onGestureToggle('swipe', e)}> Swipe Fast-Forward/Rewind</label>
          <label><input type="checkbox" .checked=${this.gestures.taps} @change=${(e: Event) => this._onGestureToggle('taps', e)}> Tap Controls</label>
          <label><input type="checkbox" .checked=${this.gestures.settingsSwipe} @change=${(e: Event) => this._onGestureToggle('settingsSwipe', e)}> Swipe Settings</label>
        </fieldset>
      </div>
    `;
  }
}

customElements.define('rsvp-settings', RsvpSettings);
