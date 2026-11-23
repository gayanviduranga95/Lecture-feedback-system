
Feature: Student Login
  As a registered student
  I want to log in to the Lecture Feedback System
  So that I can access my lecture sessions

  Scenario: BDD-01 Successful student login
    Given a registered student exists
    When the student logs in with valid credentials
    Then the login should be successful
    And the student should be authenticated

  Scenario: BDD-02 Login with incorrect password
    Given a registered student exists
    When the student logs in with an incorrect password
    Then the login should be rejected
    And the student should remain unauthenticated
