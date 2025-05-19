# Speed Control Component Spec

## Anatomy
- Root (`<sr-speed-control>`)
- Decrease Button (`.decrease`)
- Increase Button (`.increase`)
- Value Display (`.value`)

## States
- Focused / Blurred
- Disabled
- Min/Max reached

## Design Tokens
- Color: `color.tokens.json` (button, icon, text)
- Typography: `typography.tokens.json` (label, value)
- Spacing: `spacing.tokens.json` (button gap, padding)
- Radius: `radius.tokens.json` (button radius)
- Shadow: `shadow.tokens.json` (button elevation)

## Accessibility
- ARIA: `role=group`, `aria-label="Speed Control"`
- Keyboard: Arrow Up/Down (increase/decrease)
- Focus ring: Tokenized color/width

## References
- [Requirements](../../README.md)
- [Configurable Control Feature](../../features/configurable_control.feature)
- [Design Tokens](../tokens/)
