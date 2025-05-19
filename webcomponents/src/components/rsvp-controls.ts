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
    `;

    private _dispatchEvent(eventName: string) {
        this.dispatchEvent(new CustomEvent(eventName));
    }
    private _onPlayPause() {
        this._dispatchEvent('play-pause');
    }
    private _onRewind() {
        this._dispatchEvent('rewind');
    }
    private _onFastForward() {
        this._dispatchEvent('fast-forward');
    }
    private _onDecreaseSpeed() {
        this._dispatchEvent('decrease-speed');
    }
    private _onIncreaseSpeed() {
        this._dispatchEvent('increase-speed');
    }
    private _onToggleFullscreen() {
        this._dispatchEvent('toggle-fullscreen');
    }
    private _onToggleSettings() {
        this._dispatchEvent('toggle-settings');
    }

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07-.49.12.64l2.11 1.65c-.04.32-.07.) .65-.07.)198s.03.)66.)07...).'/></svg>
          </button>
        </div>
      </div>
    `;
    }
}

customElements.define('rsvp-controls', RsvpControls);
