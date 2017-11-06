#!/usr/bin/env node

const exec = require('./exec.js');
const argv = require('yargs')
  .alias('b', 'browsers')
  .alias('t', 'timeout')
  .alias('s', 'startup')
  .alias('c', 'condition')
  .alias('k', 'karmaConfig')
  .argv;

const main = require('./index.js');
const prefix = '[Burnside]: ';
const v = argv.verbose || false;
const log = str => {
  if (v) {
    console.info(prefix + str); // eslint-disable-line
  }
};

const start = (startup, condition, timeout) => {
  if (startup) {
    const timer = setTimeout(function giveUpWaiting() {
      console.error(prefix + ' Process Failed to meet Condition within ' + timeout + 'ms timeout. Check your Condition parameter or consider extending your Timeout.'); // eslint-disable-line
      process.exit(1); // eslint-disable-line
    }, timeout);
    const test = stdout => {
      return !condition || stdout.indexOf(condition) > -1;
    };
    log('Starting Process - ' + startup); // eslint-disable-line

    return exec(startup, test).then(function serverStartupComplete(server) {
      if (timer) {
        clearTimeout(timer);
      }
      log('Process Startup Complete');
      return main(argv).then(function karmaExitCode(code) {
        log('Attempting to Safely Kill Startup Process');
        return server.safeKill().then(() => {
          process.exit(code); // eslint-disable-line
        });
      });
    }).catch(err => {
      if (timer) {
        clearTimeout(timer);
      }
      console.error(prefix + ' Startup Error: ' + err); // eslint-disable-line
      process.exit(1); // eslint-disable-line
    });
  }
  return main(argv).then(function karmaExitCode(code) {
    process.exit(code); // eslint-disable-line
  }).catch(err => {
    console.error(prefix + ' Error: ' + err); // eslint-disable-line
    process.exit(1); // eslint-disable-line
  });
};

start(argv.startup, argv.condition, argv.wait || 5000);
