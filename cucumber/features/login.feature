Feature: Allow users to login and logout

  As a user
  I want to login and logout
  So that I can prove my identity and see personalized data

  Background:
    Given I am on the home page

  @watch
  Scenario: A user can login
    Given I have an account and I logged in
    When I sign out
    When I enter my email and password
    Then I should be logged in
    And I can edit my profile

  @watch
  Scenario: A user cannot login with bad information
    Given I have an account and I logged in
    When I sign out
    When I enter incorrect authentication information
    Then I should see a user not found error

  @watch
  Scenario: A user can register and login
    Given I register with some name, password and email
    Then I should be registered
    And I should be logged in
    When I sign out
    When I enter my email and password
    Then I should be logged in
    And I can edit my profile

  @skip
  Scenario: A user cannot register without accepting service conditions
    Given I register with some name, password and email but without accept conditions
    Then I shouldn't be registered
