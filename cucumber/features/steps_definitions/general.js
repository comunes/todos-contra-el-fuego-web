/* global module expect require process client */

module.exports = function doSteps() {
  let pages;

  this.Then(/^I check that exist this list of pages in the sitemap$/, (table, callback) => {
    // Write code here that turns the phrase above into concrete actions
    pages = table.raw();
    for (let i = 0; i < pages.length; i += 1) {
      // TODO download sitemap and parse
      // client.waitForText('.text', pages[i][0]);
    }
    callback();
  });

  this.Given(/^the page sitemap\.xml$/, (callback) => {
    client.url(`${process.env.ROOT_URL}/sitemap.xml`);
    callback();
  });
};
