/* global module expect require process client */

const { randomText, randomEmail } = require('./helper.js');

module.exports = function doSteps() {
  this.Given(/^I am on the zones page$/, () => {
    client.url(`${process.env.ROOT_URL}/zones`);
    if (client.isVisible('#logout')) {
      client.click('#logout');
    }
  });

  this.Then(/^I can send feedback without email$/, () => {
    client.waitForVisible('#feedback-tab', 10000);
    client.click('#feedback-tab');
    client.waitForVisible('#feedback-form', 10000);
    client.setValue('#feedbackTextarea', randomText(500));
    client.click('#sendFeedbackBtn');
    client.waitForVisible('.bert-alert', 10000, true);
    client.waitUntil(() => client.isVisible('.bert-alert') === false, 10000);
  });

  this.Then(/^I can send feedback with email$/, () => {
    client.waitForVisible('#feedback-tab', 10000);
    client.click('#feedback-tab');
    client.waitForVisible('#feedback-form', 10000);
    client.waitForEnabled('input[name="email"]');
    client.setValue('input[name="email"]', randomEmail());
    client.setValue('#feedbackTextarea', randomText(500));
    client.click('#sendFeedbackBtn');
    client.waitForVisible('.bert-alert', 10000, true);
    client.waitUntil(() => client.isVisible('.bert-alert') === false, 10000);
  });

  this.Given(/^I'm not logged$/, () => {
    client.waitForVisible('#react-root', 5000);
    if (client.isVisible('#logout')) {
      client.click('#logout');
    }
  });

  this.Given(/^I am on the fires page$/, () => {
    client.url(`${process.env.ROOT_URL}/fires`);
  });

  this.Then(/^I cannot send feedback$/, () => {
    client.waitForVisible('#react-root', 5000);
    client.waitUntil(() => client.isVisible('#feedback-tab') === false, 10000);
  });
};
