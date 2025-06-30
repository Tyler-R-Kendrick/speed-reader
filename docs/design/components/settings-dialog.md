# Settings Dialog Component Spec

## Anatomy
- Root (`<sr-settings-dialog>`)
- Dialog Overlay (`.overlay`)
- Dialog Panel (`.panel`)
- Tabs (`.tabs`) for Paste and URL modes
- Text Input Area (`textarea`)
- Dynamic Font Sizing (automatic based on player size)
- Close Button (`button`)

## States
- Open / Closed
- Focused / Blurred
- Disabled
- Closing Gesture (swipe down on mobile)

## Design Tokens
- Color: `color.tokens.json` (background, border, text, accent)
- Typography: `typography.tokens.json` (labels, headings)
- Spacing: `spacing.tokens.json` (panel padding, field gap)
- Radius: `radius.tokens.json` (panel, button radius)
- Shadow: `shadow.tokens.json` (dialog elevation)

## Accessibility
- ARIA: `role=dialog`, `aria-modal=true`, labeled by heading
- Keyboard: Tab navigation, Esc (close)
- Focus trap: Tokenized focus ring
- Touch: swipe down to close on mobile

## Configurable Fields

### Content Input
- **Paste Text** – multiline field for manual text entry.
- **Import File** – accepts `.txt`, `.html`, `.md`, `.docx` and `.odt` files.
- **URL to Load** – fetches remote content into the reader.

### Reading Preferences
- **Words Per Minute** – numeric value from 100–800 to set the initial speed.
- **LLM Provider** – choose `OpenRouter` or `OpenAI` for summaries.
- **API Key** – secret token for the selected provider.
- **Model** – LLM model identifier used when summarizing.
- **Summarize text before reading** – toggle to request a short summary.

### Keyboard Shortcuts
- Play/Pause key
- Increase Speed key
- Decrease Speed key
- Rewind key
- Fast Forward key

### Gestures
- Swipe Fast-Forward/Rewind
- Tap Controls
- Swipe Settings

## UX Requirements
- Swipe up on the player opens the settings pane when enabled.
- Swipe down on the pane closes it and must prevent page refresh.
- Controls follow Adobe Spectrum patterns for spacing and focus states.

## References
- [Requirements](../../README.md)
- [Design Tokens](../tokens/)
