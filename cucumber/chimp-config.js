module.exports = {
  // - - - - CHIMP - - - -
  /* watch: false,
   * watchTags: '@watch',
   * offline: false,
   */
  // - - - - CUCUMBER - - - -
  /* path: './features',
   * jsonOutput: 'output.json', */

  // '- - - - DEBUGGING  - - - -
  log: 'info',
  debug: false,
  seleniumDebug: false,
  webdriverLogLevel: false,
  // debugBrkCucumber: 5858,
  // - - - - WEBDRIVER-IO  - - - -
  webdriverio: {
    waitforTimeout: 10000,
    waitforInterval: 250, // KEEP SMALL (!!!) this is the INTERVAL in which waitFor* is looped fo
    desiredCapabilities: {
      chromeOptions: {
        // args: ["headless", "disable-gpu"]
        args: ['--disable-gpu', '--no-sandbox', '--headless']
      },
      isHeadless: true
    }
  }
};
