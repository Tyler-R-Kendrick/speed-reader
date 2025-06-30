Feature: Settings Pane
  The reader offers configurable settings to accommodate different workflows.

  Scenario: Adjusting reading preferences
    When I set "Words Per Minute" to 350
    Then the player starts new sessions at 350 WPM

  Scenario: Selecting an LLM provider
    When I choose "OpenAI" in the provider select
    Then summaries are requested from the OpenAI API

  Scenario: Customising keyboard shortcuts
    When I change the Play/Pause key to "P"
    Then pressing "P" toggles playback

  Scenario: Toggling gesture controls
    When I disable "Swipe Settings"
    Then swiping up does not open the settings pane
