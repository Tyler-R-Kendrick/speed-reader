import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class RsvpSettings extends LitElement {
  @property({ type: String }) text: string = '';
  @property({ type: Number }) wordFontSize: number = 3;
  @property({ type: String }) mode: 'paste' | 'url' = 'paste';
  @property({ type: String }) url: string = '';

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
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #555;
      background-color: #333;
      color: #FFFFFF;
      box-sizing: border-box;
    }
    .settings-pane textarea {
      min-height: 100px;
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
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const bodyText = doc.body.textContent ?? '';
      this.dispatchEvent(
        new CustomEvent('text-change', { detail: bodyText.trim() })
      );
    } catch {
      // Swallow network errors
    }
  }

  private _onClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _touchStartY = 0;

  private _onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') {
      this._touchStartY = e.clientY;
      e.preventDefault();
    }
  };

  private _onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }
  };

  private _onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'touch') {
      const deltaY = e.clientY - this._touchStartY;
      e.preventDefault();
      if (deltaY > 50) {
        this._onClose();
      }
    }
  };

  private _onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0] ?? e.changedTouches[0];
    if (touch) {
      this._touchStartY = touch.clientY;
      e.preventDefault();
    }
  };

  private _onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
  };

  private _onTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0] ?? e.touches[0];
    if (!touch) {
      return;
    }
    const deltaY = touch.clientY - this._touchStartY;
    e.preventDefault();
    if (deltaY > 50) {
      this._onClose();
    }
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
            <textarea id="text-input" .value=${this.text} @input=${this._onTextInput}></textarea>
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
        <button @click=${this._onClose}>Close Settings</button>
      </div>
    `;
  }
}

customElements.define('rsvp-settings', RsvpSettings);
