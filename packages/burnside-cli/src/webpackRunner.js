var webpack = require('webpack');
var c = require('./constants');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports = function runWebpack(webpackConfigPath, files, options) {
  if (!files || files.length < 1) {
    return Promise.reject(c.filesError);
  }

  const webpackConfig = require(webpackConfigPath);
  // the files passed in are relative to the parent so we need to convert them
  const parentFiles = files
    .map(function absPath(relPath) {
      return path.resolve(process.cwd(), relPath);
    });

  // write out runtime configuration and push that into the bundle
  writeBurnsideConf(options);
  parentFiles.unshift(c.confPath);

  // the injector configures Burnside and adds it to the window
  parentFiles.unshift(c.injectorPath);

  const conf = Object.assign({
    context: process.cwd(),
    entry: parentFiles
  }, webpackConfig);

  return new Promise(function wpPromise(resolve) {
    function finishedWebpacking(err, stats) {
      validateWebpack(err, stats);
      resolve(conf.output.path + '/' + conf.output.filename);
    }
    return options.autoWatch ?
      webpack(conf).watch(c.webpackWatchOpts, finishedWebpacking) :
      webpack(conf).run(finishedWebpacking);
  });
};

function writeBurnsideConf(options) {
  fs.writeFileSync(c.confPath, genConf(options));
}

function genConf(options) {
  const timeout = options.timeout || c.defaultTimeout;
  return c.confStart + timeout + c.confEnd;
}

function validateWebpack(err, stats) {
  if (err) {
    logError(err);
    return false;
  } else if (stats && stats.hasErrors()) {
    logError(stats.toJson().errors);
    return false;
  } else if (stats && stats.hasWarnings()) {
    logWarning(stats.toJson().warnings);
  }
  return true;
}

function logWarning(warn) {
  console.warn(c.warningMessage); // eslint-disable-line
  console.warn(warn); // eslint-disable-line
}

function logError(err) {
  console.error(c.errorMessage); // eslint-disable-line
  console.error(err); // eslint-disable-line
}
