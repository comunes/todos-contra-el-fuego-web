@watch
Feature: Test all secundary pages

  Scenario: Check that all secondary pages work well
    Given a list of page ids and contents
      | license     | License          |
      | tos         | Terms of Service |
      | credits     | Credits          |
      | privacy     | Privacy Policy   |
      | activeFires | Active Fires     |
    Then I check that all pages works properly

  Scenario: Check that other non visible pages work well
    Given a list of non visible pages ids and contents
      | status      | Status           |
      | error       | Upps             |
    Then I check that all non visible pages works properly
