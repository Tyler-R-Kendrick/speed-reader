# RSVP Player Component Spec

## Anatomy
- Root (`<sr-rsvp-player>`)
- Word Display (`.word`)
- Punctuation Markers (`.punctuation`)
- Controls Slot (`slot[name=controls]`)
- Progress Bar (`.progress`)

## States
- Playing / Paused
- Focused / Blurred
- Fullscreen
- Disabled

## Design Tokens
- Color: `color.tokens.json` (background, text, accent)
- Typography: `typography.tokens.json` (font family, size, weight)
- Spacing: `spacing.tokens.json` (padding, gap)
- Radius: `radius.tokens.json` (border radius)
- Shadow: `shadow.tokens.json` (elevation)

## Accessibility
- ARIA: `role=region`, `aria-label="Speed Reader Player"`
- Keyboard: Space (play/pause), F (fullscreen), Arrow keys (speed/rewind)
- Focus ring: Tokenized color/width

## References
- [Requirements](../../README.md)
- [Configurable Control Feature](../../features/configurable_control.feature)
- [Design Tokens](../tokens/)
