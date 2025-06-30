# Decision: Constant Font Size From Longest Word

## Context
Attempts to size text per word or per sentence caused the display area to grow or shrink as short words were shown. The jumping layout made the controls move and looked distracting.

## Decision
The player now measures every word when a session loads or the component resizes. It calculates the largest font size that allows the longest word to fit within the render area and applies that size to all tokens. The `.word` element uses this value for both `font-size` and `min-height`, so the reading area has a consistent height.

## Consequences
Short tokens such as ellipses no longer expand to fill the space, and long words scale down to fit. The controls remain stationary across the entire session because the render area height never changes.

This decision supersedes the font-sizing strategies described in 0003 and 0004.

