# Playback Session JSON Format

The RSVP parser outputs a serialized session description that the player consumes for playback.
The format is designed to capture all timing and punctuation information while remaining extensible.

```json
{
  "sentences": [
    {
      "markers": [],
      "tokens": [
        { "text": "Hello", "scopes": [], "delay": 0 }
      ]
    }
  ]
}
```

- **tokens[]** – words in playback order.
- **markers** – sentence level punctuation such as `?` or `!` applied to all words in the sentence.
- **text** – literal word to display.
- **scopes** – array of opening punctuation currently in scope. The player renders matching closing characters after the word.
- **delay** – additional display intervals beyond the base WPM rate.

Future fields can be added alongside `tokens` without breaking the player. The
format is parsed from and serialized to JSON using `parseSession` and
`serializeSession` in `src/parsers/session.ts`.
