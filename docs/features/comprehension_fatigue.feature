Feature: Fatigue Monitoring
  As a reader
  I want the system to monitor my fatigue levels
  So that it can prompt breaks to prevent eye strain

  Background:
    Given a reading session is active

  Scenario: Detecting fatigue via blink suppression
    When the reader detects reduced blink rate over time
    Then the system prompts the user to take a break
