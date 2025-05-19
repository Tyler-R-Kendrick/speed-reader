import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class RsvpSettings extends LitElement {
  @property({ type: String }) text: string = '';
  @property({ type: Number }) wordFontSize: number = 3;

  static styles = css`
    :host {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 10;
    }

    .settings-pane div {
      margin-bottom: 15px;
      width: 80%;
      max-width: 400px;
    }

    .settings-pane label {
      display: block;
      margin-bottom: 5px;
      color: #FFFFFF;
    }

    .settings-pane textarea,
    .settings-pane input[type="number"],
    .settings-pane input[type="range"] {
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

  private _onClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  render() {
    return html`
      <div class="settings-pane">
        <div>
          <label for="text-input">Text to Display:</label>
          <textarea id="text-input" .value=${this.text} @input=${this._onTextInput}></textarea>
        </div>
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
