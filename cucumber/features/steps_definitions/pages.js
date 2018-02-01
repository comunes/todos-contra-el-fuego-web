/* global module expect require process client */

const { goHome } = require('./helper.js');

// Does no works with arrow func
module.exports = function () {
  let pages;

  this.Given(/^a list of page ids and contents$/, (table, callback) => {
    pages = table.raw();
    callback();
  });

  function processPage(i) {
    const id = `#${pages[i][0]}`;
    const content = pages[i][1];
    client.waitForVisible(id, 10000);
    client.click(id);
    client.waitForText('#react-root', content);
  }

  this.Given(/^a list of non visible pages ids and contents$/, (table, callback) => {
    pages = table.raw();
    callback();
  });

  this.Then(/^I check that all non visible pages works properly$/, (callback) => {
    for (let i = 0; i < pages.length; i += 1) {
      client.url(`${process.env.ROOT_URL}/${pages[i][0]}`);
      const content = pages[i][1];
      client.waitForText('#react-root', content);
    }
    callback();
  });

  this.Then(/^I check that all pages works properly$/, (callback) => {
    goHome(client);
    for (let i = 0; i < pages.length; i += 1) {
      processPage(i);
    }
    callback();
  });
};
