#!/usr/bin/env node

var argv = require('yargs')
  .alias('w', 'watchmode')
  .alias('b', 'browsers')
  .alias('t', 'timeout')
  .argv;
var main = require('./index.js');

main(argv)
  .then(function karmaExitCode(code) {
    process.exit(code); // eslint-disable-line
  });
