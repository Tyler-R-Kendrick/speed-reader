Feature: Configurable Control
  As a reader
  I want to play, pause, and adjust the reading speed
  So that I can consume text at my preferred pace

  Background:
    Given a text session is loaded into the RSVP player

  Scenario: Playing and pausing the session
    When I press the "Space" key
    Then the player toggles between play and pause states

  Scenario: Increasing speed
    Given the player is playing at 300 wpm
    When I press the "Arrow Up" key
    Then the playback speed increases by a fixed increment within the range 100-800 wpm

  Scenario: Decreasing speed
    Given the player is playing at 300 wpm
    When I press the "Arrow Down" key
    Then the playback speed decreases by a fixed increment within the range 100-800 wpm

  Scenario: Rewinding words
    Given the player has advanced 10 words
    When I press the "Arrow Left" key
    Then the player rewinds exactly 5 words
