var path = require('path');
var karma = require('karma');
var Promise = require('bluebird');
var c = require('./constants.js');

function parseConfigFile(optionalPath, opts) {
  if (optionalPath) {
    return new Promise(function getConf(resolve) {
      require(path.resolve(optionalPath))(Object.assign({}, karma.constants, {
        set: function setConfig(conf) {
          resolve(Object.assign({}, conf, opts));
        }
      }));
    });
  }
  return Promise.resolve(opts || {});
}

function catArr(a, b) {
  return (a || []).concat(b || []);
}

module.exports = function runKarma(karmaConfigPath, bundle, options) {
  options.files = [bundle, c.resourcesPattern];

  return parseConfigFile(options.karmaConfig, options)
    .then(function karmaPromise(config) {
      // peel off the configured arrays so can concat them
      const configPlugins = config.plugins;
      const configFrameworks = config.frameworks;
      const configReporters = config.reporters;
      delete config.plugins;
      delete config.frameworks;
      delete config.reporters;

      const karmaConfig = karma.config.parseConfig(path.resolve(karmaConfigPath), config);

      karmaConfig.plugins = catArr(karmaConfig.plugins, configPlugins);
      karmaConfig.frameworks = catArr(karmaConfig.frameworks, configFrameworks);
      karmaConfig.reporters = catArr(karmaConfig.reporters, configReporters);

      return new Promise(function startServer(resolve) {
        var server = new karma.Server(karmaConfig, function karmaExit(exitCode) {
          resolve(exitCode); // eslint-disable-line no-process-exit
        });
        server.start();
      });
    });
};
