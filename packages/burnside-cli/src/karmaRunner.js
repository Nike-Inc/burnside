var path = require('path');
var karma = require('karma');
var Promise = require('bluebird');
var c = require('./constants.js');

module.exports = function runKarma(karmaConfigPath, bundle, options) {
  return new Promise(function karmaPromise(resolve) {
    options.files = [bundle, c.resourcesPattern];
    const karmaConfig = karma.config.parseConfig(path.resolve(karmaConfigPath), options);
    var server = new karma.Server(karmaConfig, function karmaExit(exitCode) {
      resolve(exitCode); // eslint-disable-line no-process-exit
    });

    return server.start();
  });
};
