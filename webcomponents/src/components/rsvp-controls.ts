import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-full-screen.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-full-screen-exit.js';

export class RsvpControls extends LitElement {
    static properties = {
        playing: { type: Boolean },
        wpm: { type: Number },
        isFullscreen: { type: Boolean },
        isEnded: { type: Boolean },
    };

    @property({ type: Boolean }) playing: boolean = false;
    @property({ type: Number }) wpm: number = 300;
    @property({ type: Boolean }) isFullscreen: boolean = false;
    @property({ type: Boolean }) isEnded: boolean = false;

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
        let playPauseIcon;
        let playPauseLabel = 'Play';
        if (this.isEnded) {
            playPauseIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5z"/></svg>`;
            playPauseLabel = 'Replay';
        } else if (this.playing) {
            playPauseIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
            playPauseLabel = 'Pause';
        } else {
            playPauseIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        }
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
            ${this.isFullscreen
              ? html`<sp-icon-full-screen-exit></sp-icon-full-screen-exit>`
              : html`<sp-icon-full-screen></sp-icon-full-screen>`}
          </button>
          <button @click=${this._onToggleSettings} aria-label="Settings" part="settings-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 0 0 .12-.62l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.07 7.07 0 0 0-1.52-.88l-.38-2.65a.5.5 0 0 0-.49-.42h-4.16a.5.5 0 0 0-.49.42l-.38 2.65a6.96 6.96 0 0 0-1.52.88l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.62L4.57 10c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 0 0-.12.62l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.47.39.99.71 1.52.88l.38 2.65c.03.24.25.42.49.42h4.16c.24 0 .46-.18.49-.42l.38-2.65c.53-.2 1.05-.49 1.52-.88l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.62L19.43 12.98zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    }
}

customElements.define('rsvp-controls', RsvpControls);
