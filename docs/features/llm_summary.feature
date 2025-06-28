Feature: LLM Summary
  As a reader
  I want the system to generate a concise summary using my LLM endpoint
  So that I can quickly grasp the main ideas of the text

  Background:
    Given a text document is loaded in the reader
    And I have configured a valid LLM endpoint and API key

  Scenario: Enabling the summary toggle
    Given the LLM configuration form has a provider, model and API key
    When I enable "Summarize text before reading"
    Then the toggle becomes active for all text input methods

  Scenario: Requesting an AI-generated summary
    Given "Summarize text before reading" is enabled
    When I load a document
    Then the system sends the document to the LLM endpoint
    And parses the returned summary instead of the original text

  Scenario: Summary request error handling
    Given the LLM endpoint returns an error
    When I request a summary
    Then the system displays an error message to the user

  Scenario: Persistence of LLM configuration
    Given I set the LLM endpoint URL and API key in settings
    When I reload the reader
    Then the LLM configuration persists and is ready for use
