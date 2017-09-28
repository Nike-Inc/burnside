var c = require('./constants');
var runKarma = require('./karmaRunner.js');
var runWebpack = require('./webpackRunner.js');

module.exports = function main(args) {
  const files = args._;
  const watchmode = args.watchmode;
  const browserOpts = args.browsers || c.defaultBrowsers;
  const timeout = Boolean(args.timeout) && args.timeout > 0 ? args.timeout : c.defaultTimeout;

  const options = {
    singleRun: !watchmode,
    browsers: parseBrowsers(browserOpts),
    autoWatch: watchmode,
    browserNoActivityTimeout: timeout,
    client: {
      mocha: {
        timeout
      }
    }
  };

  if (args.h || args.help) {
    console.log(c.helpMessage); // eslint-disable-line
  }

  return runWebpack(c.webpackPath, files, options)
    .then(function webpackResults(bundle) {
      return runKarma(c.karmaPath, bundle, options);
    }).catch(function catchError(e) {
      console.log(c.errorMessage); // eslint-disable-line
      console.log(e); // eslint-disable-line
    });
};

function parseBrowsers(browserList) {
  var browsers = [];
  browserList.split(',').forEach(browserName => {
    if (browserName && browserName.length > 0) {
      browsers.push(c.browserPrefix + browserName);
    }
  });
  return browsers;
}
