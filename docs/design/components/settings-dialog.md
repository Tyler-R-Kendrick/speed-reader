# Settings Dialog Component Spec

## Anatomy
- Root (`<sr-settings-dialog>`)
- Dialog Overlay (`.overlay`)
- Dialog Panel (`.panel`)
- Tabs/Sections (`.tabs`)
- Form Fields (`.field`)
- Save/Cancel Buttons (`.actions`)

## States
- Open / Closed
- Focused / Blurred
- Disabled

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

## References
- [Requirements](../../README.md)
- [Design Tokens](../tokens/)
