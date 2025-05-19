Feature: LLM Summary
  As a reader
  I want the system to generate a concise summary using my LLM endpoint
  So that I can quickly grasp the main ideas of the text

  Background:
    Given a text document is loaded in the reader
    And I have configured a valid LLM endpoint and API key

  Scenario: Requesting an AI-generated summary
    When I click the "Generate Summary" button
    Then the system sends the document to the LLM endpoint
    And displays the returned summary above the text

  Scenario: Summary request error handling
    Given the LLM endpoint returns an error
    When I request a summary
    Then the system displays an error message to the user

  Scenario: Persistence of LLM configuration
    Given I set the LLM endpoint URL and API key in settings
    When I reload the reader
    Then the LLM configuration persists and is ready for use
