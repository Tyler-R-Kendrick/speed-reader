# Punctuation Rendering Rules

The RSVP player handles punctuation to preserve reading rhythm while signalling sentence boundaries.

- **Sentence markers**
  - A sentence ending with `?` displays a question mark below every word in that sentence.
  - A sentence ending with `!` shows an exclamation mark below every word.
  - If a sentence ends with both (`?!` or `!?`), both symbols appear beneath each word.
- **Ellipses**
  - An ellipsis (`...`) is rendered as a sequence of three words: `.` then `..` then `...`.
  - Each period remains onscreen until the full ellipsis is shown, using the current WPM delay for each step.
- **Commas**
  - Commas do not appear onscreen but cause the preceding word to stay for one extra delay interval.
- **Colons & Semicolons**
  - `:` and `;` are treated like commas. They are hidden and add one extra delay to the word before them.
- **Periods**
  - A period that ends a sentence does not display and has no extra delay.
- **Default**
  - Any other punctuation characters remain as part of the word and do not alter timing.

These rules ensure visual cues for questioning or emphatic sentences while keeping pacing consistent.
