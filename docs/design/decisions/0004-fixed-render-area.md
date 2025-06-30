# Decision: Lock Render Area Height Across Session

## Context
Users reported that the word container height still changed when sentences contained longer words. They also wanted the text to scale with the available width without affecting control placement.

## Decision
The player now pre-computes the largest font size required for any word in the current session. This value is stored in the `--max-font-size` CSS variable and applied to the `.word` element's `min-height` so the reading area never grows or shrinks. Each sentence's font size is measured separately but capped at this maximum so text scales to fill the width while the overall height stays fixed.

## Consequences
Controls below the word remain stationary across the entire session. Short tokens no longer inflate in size, and long words scale down to fit within the available width while respecting the predetermined height.
