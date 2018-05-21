Feature: Allow users to give feedback

  As a user (authenticated or not)
  I want to give feedback about this site

  Scenario: A user can login and give feedback
    Given I am on the zones page
    And I have an account and I logged in
    # Because is not verified
    Then I can send feedback with email
    When I sign out
    Given I'm not logged
    Then I can send feedback with email

  Scenario: A anon user can give feedback
    Given I am on the fires page
    Given I'm not logged
    Then I can send feedback with email

  Scenario: A user cannot give feedback in home
    Given I am on the home page
    Then I cannot send feedback
