import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-full-screen.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-full-screen-exit.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-play.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-pause.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-replay.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-rewind.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-fast-forward.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-remove.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-add.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';

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
            playPauseIcon = html`<sp-icon-replay></sp-icon-replay>`;
            playPauseLabel = 'Replay';
        } else if (this.playing) {
            playPauseIcon = html`<sp-icon-pause></sp-icon-pause>`;
            playPauseLabel = 'Pause';
        } else {
            playPauseIcon = html`<sp-icon-play></sp-icon-play>`;
        }
        return html`
      <div class="controls">
        <div class="control-group">
          <button @click=${this._onPlayPause} aria-label=${playPauseLabel}>
            ${playPauseIcon}
          </button>
          <button @click=${this._onRewind} aria-label="Rewind">
            <sp-icon-rewind></sp-icon-rewind>
          </button>
          <button @click=${this._onFastForward} aria-label="Fast Forward">
            <sp-icon-fast-forward></sp-icon-fast-forward>
          </button>
        </div>
        <span class="wpm">${this.wpm} WPM</span>
        <div class="control-group">
          <button @click=${this._onDecreaseSpeed} aria-label="Decrease speed">
            <sp-icon-remove></sp-icon-remove>
          </button>
          <button @click=${this._onIncreaseSpeed} aria-label="Increase speed">
            <sp-icon-add></sp-icon-add>
          </button>
          <button @click=${this._onToggleFullscreen} aria-label="Toggle Fullscreen">
            ${this.isFullscreen
              ? html`<sp-icon-full-screen-exit></sp-icon-full-screen-exit>`
              : html`<sp-icon-full-screen></sp-icon-full-screen>`}
          </button>
          <button @click=${this._onToggleSettings} aria-label="Settings" part="settings-button">
            <sp-icon-settings></sp-icon-settings>
          </button>
        </div>
      </div>
    `;
    }
}

customElements.define('rsvp-controls', RsvpControls);
