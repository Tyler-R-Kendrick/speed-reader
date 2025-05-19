# Gradient Text Component Spec

## Anatomy
- Root (`<sr-gradient-text>`)
- Text Content (`.text`)
- Gradient Layer (`.gradient`)

## States
- Default
- Focused / Blurred
- Disabled

## Design Tokens
- Color: `color.tokens.json` (gradient stops, text)
- Typography: `typography.tokens.json` (font family, size)
- Spacing: `spacing.tokens.json` (padding)

## Accessibility
- ARIA: `role=text`, `aria-label` for content
- Keyboard: Focusable for accessibility

## References
- [Requirements](../../README.md)
- [Gradient-Guided Text Feature](../../features/gradient_guided_text.feature)
- [Design Tokens](../tokens/)
