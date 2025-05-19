Feature: Eye-Tracking Integration
  As a reader with compatible hardware
  I want the reader to respond to my gaze
  So that reading pauses or adjusts when I look away or regress

  Background:
    Given a web cam is connected

  Scenario: Auto-pause on gaze away
    When the user’s gaze moves outside the focal region
    Then the player pauses automatically

