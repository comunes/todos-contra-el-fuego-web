/* global client */

(function () {
  module.exports = function () {
    const printLog = (type) => {
      client.log(type).value.forEach((logItem) => {
        const { source, message } = logItem;
        if (type === 'browser' && source === 'console-api') {
          // Clean messages of type:
          // http://localhost:3000/app/app.js?hash=34da4258bd2caa4e14c7c0c20ba6396f309e7236 13325:18 "GMaps script just loaded"
          // to get the last part
          const cleanMessage = message.replace(/[^ ]{1,} [^ ]{1,} "(.*)"$/g, '$1');
          console.log(`${logItem.level}: ${cleanMessage}`);
        } else {
          // Right now we don't need logs like:
          // %cDownload the React DevTools for a better development experience: https://fb.me/react-devtools
          // console.log(`${logItem.level}: ${message}`);
        }
      });
    };

    this.StepResult((stepResult) => {
      if (stepResult.getStatus() === 'failed') {
        // http://webdriver.io/api/protocol/log.html
        console.log(`Step result: ${stepResult.getStatus()}`);
        printLog('browser');
      }
    });

    this.Before(() => {
      //  global.expect = require('@xolvio/jasmine-expect').expect;

      // https://github.com/webdriverio/webdriverio/issues/1145
      if (!this.initMyCmds) {
        client.addCommand('waitForClickable', function elementClickable(selector, timeout) {
          this.waitForVisible(selector, timeout);
          this.waitForEnabled(selector, timeout);
        });

        client.addCommand('waitUntilText', function waitUntilText(selector, text, ms) {
          ms = ms || 5000;
          this.waitForVisible(selector);
          const self = this;
          this.waitUntil(() => self.getText(selector).includes(text), ms, `expected text in ${selector} be different after ${ms / 1000}s. Obtained: '${self.getText(selector)}' expected: '${text}'`);
        });

        this.initMyCmds = true;
      }

      client.windowHandleSize({ width: 1500, height: 1000 });

      // server.call('fixtures/reset');
      // server.call('emailStub/reset');
      // server.call('emailStub/stub');
      // server.call('fixtures/stubCloudFrontClient');

      // go to the page first so we have access to the Meteor object
      // console.log('Before all tests...');
      // client.url(process.env.ROOT_URL);
      /* client.executeAsync(function (done) {
       *   var customer = {
       *     id: 'randomId',
       *     email: 'me@example.com',
       *     subscriptions: {
       *       data: [{
       *         current_period_start: 1436716844,
       *         current_period_end: 1436716844
       *       }]
       *     }
       *   }; */
      // this call will stub stripe both on the client and server
      // Meteor.call('stripeStub/stub', customer, done);
    });
  };
}());
