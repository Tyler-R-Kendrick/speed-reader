import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class RsvpControls extends LitElement {
    static properties = {
        playing: { type: Boolean },
        wpm: { type: Number },
    };

    @property({ type: Boolean }) playing: boolean = false;
    @property({ type: Number }) wpm: number = 300;

    static styles = css`
        .controls {
        background-color: rgba(0, 0, 0, 0.8);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        margin-top: 16px;
        }
        .controls button {
        background-color: transparent;
        color: #FFFFFF;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 1rem;
        border-radius: 4px;
        }
        .controls button:hover {
        color: #CCCCCC;
        background-color: rgba(255, 255, 255, 0.1);
        }
        .wpm {
        color: #FFFFFF;
        font-size: 14px;
        margin: 0 10px;
        }
        .control-group {
        display: flex;
        align-items: center;
        }

        @media (max-width: 600px) {
        .controls {
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
        }
        }
    `;

    private _dispatchEvent = (eventName: string) => {
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
    };

    private _onPlayPause = () => {
        this._dispatchEvent('play-pause');
    };

    private _onRewind = () => {
        this._dispatchEvent('rewind');
    };

    private _onFastForward = () => {
        this._dispatchEvent('fast-forward');
    };

    private _onDecreaseSpeed = () => {
        this._dispatchEvent('decrease-speed');
    };

    private _onIncreaseSpeed = () => {
        this._dispatchEvent('increase-speed');
    };

    private _onToggleFullscreen = () => {
        this._dispatchEvent('toggle-fullscreen');
    };

    private _onToggleSettings = () => {
        this._dispatchEvent('toggle-settings');
    };

    render() {
        const playPauseIcon = this.playing
            ? html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
            : html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        const playPauseLabel = this.playing ? 'Pause' : 'Play';

        // paths for fullscreen icons
        const enterFullscreenPath = "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-2-4h2V7h-3V5h5v5z";
        const exitFullscreenPath = "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z";

        return html`
      <div class="controls">
        <div class="control-group">
          <button @click=${this._onPlayPause} aria-label=${playPauseLabel}>
            ${playPauseIcon}
          </button>
          <button @click=${this._onRewind} aria-label="Rewind">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
          </button>
          <button @click=${this._onFastForward} aria-label="Fast Forward">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m4 18 8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
          </button>
        </div>
        <span class="wpm">${this.wpm} WPM</span>
        <div class="control-group">
          <button @click=${this._onDecreaseSpeed} aria-label="Decrease speed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
          </button>
          <button @click=${this._onIncreaseSpeed} aria-label="Increase speed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button @click=${this._onToggleFullscreen} aria-label="Toggle Fullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              ${this.playing /* placeholder for proper fullscreenElement check */
                ? html`<path d="${exitFullscreenPath}"/>`
                : html`<path d="${enterFullscreenPath}"/>`}
            </svg>
          </button>
          <button @click=${this._onToggleSettings} aria-label="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .11-.59l-1.91-3.27a.5.5 0 0 0-.6-.22l-2.34.94a6.98 6.98 0 0 0-1.6-.95l-.35-2.47a.5.5 0 0 0-.49-.42h-3.78a.5.5 0 0 0-.49.42l-.35 2.47a6.98 6.98 0 0 0-1.6.95l-2.34-.94a.5.5 0 0 0-.6.22l-1.91 3.27a.5.5 0 0 0 .11.59l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.11.59l1.91 3.27c.12.21.38.3.6.22l2.34-.94c.5.39 1.04.71 1.6.95l.35 2.47c.03.24.25.42.49.42h3.78c.24 0 .46-.18.49-.42l.35-2.47c.56-.24 1.1-.56 1.6-.95l2.34.94c.22.08.48-.01.6-.22l1.91-3.27a.5.5 0 0 0-.11-.59l-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    }
}

customElements.define('rsvp-controls', RsvpControls);
