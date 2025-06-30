import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/accordion/sp-accordion.js';
import '@spectrum-web-components/accordion/sp-accordion-item.js';
import '@spectrum-web-components/button/sp-close-button.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/tabs/sp-tab.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/dialog/sp-dialog.js';
import {
  HtmlParser,
  MarkdownParser,
  TextParser,
  DocxParser,
  OdtParser,
} from '../parsers/content-parser';
import { requestSummary, LlmConfig } from '../llm/summary';

const TEXT_CHANGE_EVENT = 'text-change';

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
  @property({ type: Number }) wpm = 300;
  @property({ type: Object }) llmConfig: LlmConfig = {
    provider: 'openrouter',
    apiKey: '',
    model: 'gpt-3.5-turbo',
  };
  @property({ type: Boolean }) useLlmSummary = false;

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      background-color: rgba(0, 0, 0, 0.7);
      overscroll-behavior: contain;
      z-index: 1000;
    }

    .panel {
      width: 90vw;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      background-color: var(--spectrum-global-color-gray-50);
      color: var(--spectrum-alias-text-color);
      border-radius: var(--spectrum-alias-border-radius-medium);
      padding: var(--spectrum-global-dimension-size-200);
      box-shadow: var(--spectrum-global-shadow-medium);
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
      .panel {
        width: 100%;
        height: 100%;
        max-width: none;
        border-radius: 0;
      }
    }

    .close-row {
      display: flex;
      justify-content: flex-end;
    }

    sp-accordion {
      margin-top: var(--spectrum-global-dimension-size-200);
    }
  `;

  private async _onTextInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    const processed = await this._maybeSummarize(value);
    this.dispatchEvent(new CustomEvent(TEXT_CHANGE_EVENT, { detail: processed }));
  }


  private async _maybeSummarize(text: string): Promise<string> {
    if (this.useLlmSummary && this.llmConfig.apiKey) {
      try {
        return await requestSummary(text, this.llmConfig);
      } catch {
        return text;
      }
    }
    return text;
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
      const ct = res.headers?.get('content-type') ?? '';
      const isMarkdown =
        ct.includes('markdown') ||
        this.url.toLowerCase().endsWith('.md') ||
        this.url.toLowerCase().endsWith('.markdown');
      const parser = isMarkdown ? new MarkdownParser() : new HtmlParser();
      const parsed = await parser.parse(text);
      const processed = await this._maybeSummarize(parsed);
      this.dispatchEvent(
        new CustomEvent(TEXT_CHANGE_EVENT, { detail: processed })
      );
    } catch {
      // Swallow network errors
    }
  }

  private _onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = file.type;
    const isHtml = type.includes('html') || ext === 'html' || ext === 'htm';
    const isMarkdown =
      type.includes('markdown') || ext === 'md' || ext === 'markdown';
    const isDocx =
      type.includes('officedocument.wordprocessingml') || ext === 'docx';
    const isOdt =
      type.includes('opendocument.text') || ext === 'odt';
    let parser:
      | HtmlParser
      | MarkdownParser
      | TextParser
      | DocxParser
      | OdtParser;
    const readAsBuffer = isDocx || isOdt;
    if (isHtml) {
      parser = new HtmlParser();
    } else if (isMarkdown) {
      parser = new MarkdownParser();
    } else if (isDocx) {
      parser = new DocxParser();
    } else if (isOdt) {
      parser = new OdtParser();
    } else {
      parser = new TextParser();
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const content = reader.result as string | ArrayBuffer;
      parser
        .parse(content)
        .then(parsed => this._maybeSummarize(parsed))
        .then(processed => {
          this.text = processed;
          this.dispatchEvent(
            new CustomEvent(TEXT_CHANGE_EVENT, { detail: processed })
          );
        })
        .finally(() => {
          input.value = '';
        });
    });
    if (readAsBuffer) {
      // eslint-disable-next-line unicorn/prefer-blob-reading-methods
      reader.readAsArrayBuffer(file);
    } else {
      // eslint-disable-next-line unicorn/prefer-blob-reading-methods
      reader.readAsText(file);
    }
  }

  private _onWpmInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.wpm = parseInt(target.value, 10);
    this.dispatchEvent(new CustomEvent('wpm-change', { detail: this.wpm }));
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

  private _onApiKeyInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.llmConfig = { ...this.llmConfig, apiKey: target.value };
  }

  private _onModelInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.llmConfig = { ...this.llmConfig, model: target.value };
  }

  private _onSummaryToggle(e: Event) {
    const target = e.target as HTMLInputElement;
    this.useLlmSummary = target.checked;
  }

  private _onClose() {
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true })
    );
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

  // eslint-disable-next-line max-lines-per-function
  render() {
    const pasteActive = this.mode === 'paste';
    return html`
      <sp-theme color="dark" scale="medium">
        <div class="panel" role="dialog" aria-label="Settings">
          <div class="close-row">
            <sp-close-button class="close-button" @click=${this._onClose} quiet></sp-close-button>
          </div>
          <sp-accordion allow-multiple>
            <sp-accordion-item label="Content" open>
              <sp-tabs
                selected=${pasteActive ? 'paste' : 'url'}
                @change=${(e: Event) => { this.mode = (e.target as any).selected as 'paste' | 'url'; }}>
                <sp-tab value="paste">Paste Text</sp-tab>
              <sp-tab value="url">From URL</sp-tab>
            </sp-tabs>
            ${pasteActive ? html`
              <div>
                <sp-field-label for="text-input">Text to Display:</sp-field-label>
                <sp-textfield
                  multiline
                  id="text-input"
                  .value=${this.text}
                  @input=${this._onTextInput}
                  ?readonly=${this.mode === 'url'}
                  aria-readonly=${this.mode === 'url'}
                ></sp-textfield>
                <sp-field-label for="file-input">Import File:</sp-field-label>
                <input
                  id="file-input"
                  type="file"
                  accept=".txt,.html,.md,.markdown,.docx,.odt,text/plain,text/html,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text"
                  @change=${this._onFileChange}
                >
              </div>
            ` : html`
              <div>
                <sp-field-label for="url-input">URL to Load:</sp-field-label>
                <sp-textfield id="url-input" type="url" .value=${this.url} @input=${this._onUrlInput}></sp-textfield>
                <sp-button class="load-url" variant="primary" @click=${this._loadUrl}>Load Content</sp-button>
              </div>
            `}
          </sp-accordion-item>
          <sp-accordion-item label="Reading" open>
            <label>Words Per Minute
              <input
                id="setting-wpm"
                type="number"
                min="100"
                max="800"
                .value=${String(this.wpm)}
                @input=${this._onWpmInput}
              >
            </label>
          </sp-accordion-item>
          <sp-accordion-item label="LLM Summary">
            <label>Provider
              <select id="llm-provider" .value=${this.llmConfig.provider} @change=${(e: Event) => {
                const target = e.target as HTMLSelectElement;
                this.llmConfig = { ...this.llmConfig, provider: target.value as 'openrouter' | 'openai' };
              }}>
                <option value="openrouter">OpenRouter</option>
                <option value="openai">OpenAI</option>
              </select>
            </label>
            <label>API Key
              <input id="llm-key" type="password" .value=${this.llmConfig.apiKey} @input=${this._onApiKeyInput}>
            </label>
            <label>Model
              <input id="llm-model" type="text" .value=${this.llmConfig.model} @input=${this._onModelInput}>
            </label>
            <label><input id="llm-summary" type="checkbox" .checked=${this.useLlmSummary} ?disabled=${!this.llmConfig.apiKey} @change=${this._onSummaryToggle}> Summarize text before reading</label>
          </sp-accordion-item>
          <sp-accordion-item label="Shortcuts">
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
          </sp-accordion-item>
          <sp-accordion-item label="Gestures">
            <label><input type="checkbox" .checked=${this.gestures.swipe} @change=${(e: Event) => this._onGestureToggle('swipe', e)}> Swipe Fast-Forward/Rewind</label>
            <label><input type="checkbox" .checked=${this.gestures.taps} @change=${(e: Event) => this._onGestureToggle('taps', e)}> Tap Controls</label>
            <label><input type="checkbox" .checked=${this.gestures.settingsSwipe} @change=${(e: Event) => this._onGestureToggle('settingsSwipe', e)}> Swipe Settings</label>
          </sp-accordion-item>
          </sp-accordion>
        </div>
      </sp-theme>
    `;
  }
}

customElements.define('rsvp-settings', RsvpSettings);
