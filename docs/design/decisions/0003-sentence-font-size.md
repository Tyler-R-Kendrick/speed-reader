# Decision: Fix Word Area Height Per Sentence

## Context
The original player recalculated font size for every word. Short tokens such as ellipses could become very large and the controls below the word jumped up and down as the text height changed.

## Decision
Font size is now computed for the longest word in the current sentence. The result is cached until the sentence changes or the player resizes. The `.word` element uses this size for `font-size` and `min-height`, keeping the render area stable across the sentence.

## Consequences
This prevents the text region from growing or shrinking between words and keeps controls stationary. Very short words no longer appear at exaggerated sizes.
