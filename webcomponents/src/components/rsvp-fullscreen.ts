import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export class RsvpFullscreen extends LitElement {
  static styles = css`
    button {
      background-color: transparent;
      color: #FFFFFF;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 1rem;
      border-radius: 4px;
    }
    button:hover {
      color: #CCCCCC;
      background-color: rgba(255, 255, 255, 0.1);
    }
  `;

  private _onToggle() {
    this.dispatchEvent(new CustomEvent('toggle-fullscreen', { bubbles: true, composed: true }));
  }

  render() {
    const enterPath = "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-2-4h2V7h-3V5h5v5z";
    const exitPath = "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z";
    const isFs = !!document.fullscreenElement;
    return html`
      <button @click=${this._onToggle} aria-label="Toggle Fullscreen">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="${isFs ? exitPath : enterPath}" />
        </svg>
      </button>
    `;
  }
}

customElements.define('rsvp-fullscreen', RsvpFullscreen);
