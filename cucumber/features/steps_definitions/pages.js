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
    // https://jasmine.github.io/2.3/introduction.html#section-Expectations
    expect(client.getTitle()).toContain(pages[i][1]);
  }

  function processPageUrl(i) {
    const url = `${pages[i][0]}`;
    const content = pages[i][1];
    client.url(`${process.env.ROOT_URL}/${url}`);
    client.waitForVisible('#react-root', 10000);
    client.waitForText('#react-root', content);
    const checkTitle = pages[i][2] === 'true';
    // https://jasmine.github.io/2.3/introduction.html#section-Expectations
    if (checkTitle) {
      expect(client.getTitle()).toContain(pages[i][1]);
    }
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
    if (client.isVisible('#logout')) {
      client.click('#logout');
    }
    for (let i = 0; i < pages.length; i += 1) {
      processPage(i);
    }
    callback();
  });

  this.Given(/^a list of page urls and contents$/, (table, callback) => {
    pages = table.raw();
    callback();
  });

  this.Then(/^I check that all page urls works properly$/, (callback) => {
    goHome(client);
    for (let i = 0; i < pages.length; i += 1) {
      processPageUrl(i);
    }
    callback();
  });

  this.Then(/^they are spiderable$/, (callback) => {
    // Write code here that turns the phrase above into concrete actions
    for (let i = 0; i < pages.length; i += 1) {
      client.url(`${process.env.ROOT_URL}/${pages[i][0]}?_escaped_fragment_=`);
      client.waitForText('#react-root', pages[i][1]);
    }
    callback();
  });
};
