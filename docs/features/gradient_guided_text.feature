Feature: Gradient-Guided Text
  As a reader
  I want color-gradient guidance applied to continuous text
  So that my eye movements follow the line naturally and improve reading flow

  Background:
    Given a continuous text is loaded in the reader

  Scenario: Applying gradient to text lines
    When the text is rendered
    Then each line displays a visual gradient that indicates the progression of reading

  Scenario: Mode switch persists across sessions
    Given I enable Gradient-Guided Text
    And I reload the page
    Then the reader initializes with Gradient-Guided Text
