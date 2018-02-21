Feature: This app should generate a correct sitemap, etc

  Scenario: I verify that a sitemap is generated correctly
    Given the page sitemap.xml
    Then I check that exist this list of pages in the sitemap
      | license | License          |
      | terms   | Terms of Service |
      | credits | Credits          |
      | privacy | Privacy Policy   |
      | fires   | Active Fires     |
      | login   | Login            |
      | signup  | Signup           |
