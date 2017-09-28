const path = require('path');
module.exports.moduleName = 'burnside-cli';

// file paths
module.exports.karmaPath = path.join(__dirname, '../karma.conf.js');
module.exports.webpackPath = path.join(__dirname, '../webpack.config.js');
module.exports.injectorPath = path.join(__dirname, './inject.js');
module.exports.confPath = path.join(__dirname, './conf.tmp.js');

// constants
module.exports.confStart = 'window.Burnside.configure({timeout: ';
module.exports.confEnd = '});\n';
module.exports.browserPrefix = 'burnside-';
module.exports.defaultBrowsers = 'chrome';
module.exports.defaultTimeout = 9999999;
module.exports.filesError = 'Please pass a file to test';
module.exports.warningMessage = 'Karma Warnings:';
module.exports.errorMessage = 'Attention: Burnside-CLI has encountered an issue:';
module.exports.helpMessage = 'Usage: burnside ./path/to/tests.js';

module.exports.webpackWatchOpts = { // watch options:
  aggregateTimeout: 300, // wait so long for more changes
  poll: true // use polling instead of native watchers
  // pass a number to set the polling interval
};

module.exports.resourcesPattern = {
  pattern: 'resources/**/*',
  watched: true, included: false, served: true
};
