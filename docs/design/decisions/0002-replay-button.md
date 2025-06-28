# Decision: Add Replay State

## Context
User feedback indicated confusion when playback stopped at the end of a session. The play button continued to display the play icon even though pressing it restarted the text.

## Decision
Introduce a distinct `Replay` state in the controls. When the last word has been displayed and playback has stopped, the play/pause control now shows a replay icon and `aria-label` of `Replay`. Pressing this button resets the session to the beginning and resumes playback, after which the control returns to the standard play/pause behaviour.

## Consequences
This clarifies that the session has finished and improves usability on both desktop and mobile. The change required exposing an `isEnded` property on the `rsvp-controls` component and updating tests.
