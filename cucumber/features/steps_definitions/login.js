/* global module expect require process client */

const {
  goHome, randomUsername, randomPassword, randomEmail
} = require('./helper.js');

let firstName;
let lastName;
let pass;
let email;

const setUserValues = (isEdit) => {
  client.waitForVisible('input[name="firstName"]', 5000);
  firstName = randomUsername();
  lastName = randomUsername();
  email = randomEmail();
  client.setValue('input[name="firstName"]', firstName);
  client.setValue('input[name="lastName"]', lastName);
  client.setValue('input[name="emailAddress"]', email);
  if (isEdit) {
    client.setValue('input[name="currentPassword"]', pass);
    pass = randomPassword();
    client.setValue('input[name="newPassword"]', pass);
  } else {
    pass = randomPassword();
    client.setValue('input[name="password"]', pass);
  }
};

module.exports = function doSteps(notos) {
  this.Given(/^I am on the home page$/, () => {
    goHome(client);
  });

  function register() {
    if (client.isVisible('#logout')) {
      client.click('#logout');
    }
    client.waitForVisible('#signup', 5000);
    client.click('#signup');
    setUserValues();
    if (!notos) {
      client.click('input[name="tos"]');
    }
    client.click('#signUpSubmit');
  }

  this.Given(/^I have an account and I logged in$/, () => {
    register();
  });

  function checkName() {
    client.waitForVisible('#profile', 5000);
    client.waitForText('#profile', firstName);
    client.waitForText('#profile', lastName);
  }

  this.Then(/^I should be logged in$/, () => {
    client.waitUntil(() => client.isVisible('#logout') === true, 10000);
  });

  /* this.Given(/^I am signed out$/, () => {
   *   client.waitUntil(() => client.isVisible('#logout') === true, 10000);
   * });
   */

  function closeAlert() {
    // client.waitForVisible('.bert-alert', 5000);
    // client.click('.bert-content');
    client.waitUntil(() => client.isVisible('.bert-alert') === false, 10000);
  }

  this.When(/^I sign out$/, () => {
    if (client.isVisible('.bert-alert')) {
      client.waitUntil(() => client.isVisible('.bert-alert') === false, 10000);
    }
    client.waitForVisible('#logout', 10000);
    client.click('#logout');
    client.waitForVisible('#login', 10000);
  });

  function login(badpass) {
    client.waitForVisible('#login', 10000);
    client.waitUntil(() => client.isVisible('.bert-alert') === false, 10000);
    client.click('#login');
    client.waitForVisible('#loginSubmit', 5000);
    client.setValue('input[name="emailAddress"]', email);
    client.setValue('input[name="password"]', badpass ? randomPassword() : pass);
    client.click('#loginSubmit');
    closeAlert();
  }

  this.When(/^I enter my email and password$/, () => {
    login();
  });

  this.Then(/^I can edit my profile$/, () => {
    client.waitForVisible('#profile', 5000);
    client.click('#profile');
    setUserValues(true);
    client.click('#profileSubmit');
    closeAlert();
    checkName();
  });

  this.When(/^I enter incorrect authentication information$/, () => {
    login(true);
  });

  this.Then(/^I should see a user not found error$/, () => {
    client.waitForVisible('.alert-danger', 10000, true);
  });

  this.Given(/^I register with some name, password and email$/, () => {
    register();
  });

  this.Then(/^I should be registered$/, () => {
    client.waitForVisible('.bert-alert', 10000, true);
    closeAlert();
  });

  this.Given(/^I register with some name, password and email but without accept conditions$/, () => {
    register(true);
  });

  this.Then(/^I shouldn't be registered$/, () => {
    client.waitForVisible('.bert-alert', 10000, true);
    client.waitForVisible('#login', 10000, true);
  });
};
