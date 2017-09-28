var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var packagesDir = path.resolve(process.cwd(), './packages');
var copyCreds = 'cp ../../.npmrc .';
var publishAll = 'npm publish ' + process.argv.slice(2).join(' ');

// taken from: https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
const getDirectories = srcPath =>
  fs.readdirSync(srcPath)
    .filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());

getDirectories(packagesDir).forEach(dir => {
  const opts = {
    cwd: path.resolve(packagesDir, './' + dir)
  };
  console.log('Copying Credentials for:', dir);
  exec(copyCreds, opts, function(credErr, credOut) {
    console.log(credOut);
    if (credErr) {
      console.warn('Suppressing Credentials Error', credErr);
    }

    console.log('Publishing', dir);
    exec(publishAll, opts, function(publishErr, publishOut) {
      console.log(publishOut);
      if (publishErr) {
        console.warn('Suppressing Publish Error', publishErr);
      }
    });
  });
});
