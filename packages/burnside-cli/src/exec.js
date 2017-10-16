const exec = require('child_process').exec;
const Promise = require('bluebird');
const psTree = require('ps-tree');

const isWin = /^win/.test(process.platform);

const kill = pid => {
  return new Promise((resolve, reject) => {
    const signal = 'SIGKILL';
    psTree(pid, (err, children) => {
      if (err) {
        reject(err);
      }

      [pid].concat(children.map(p => p.PID)).forEach(tpid => {
        try {
          if (isWin) {
            // taken from http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
            exec('taskkill /PID ' + pid + ' /T /F', function ignore() {});
          } else {
            process.kill(tpid, signal);
          }
        } catch (ex) {} // eslint-disable-line
      });
      resolve();
    });
  });
};

// Exeutes a shell command, captures the output and waits for close
// Returns a Promise that resolves with the child process and a new safeKill function
module.exports = function runAndCapture(command, test) {
  return new Promise((resolve, reject) => {
    const child = exec(command, {stdio: 'pipe'});
    child.safeKill = () => kill(child.pid);
    var stdout = '';
    child.stdout.on('data', d => {
      stdout += d;
      if (test(stdout)) {
        resolve(child);
      }
    });

    child.stderr.on('data', d => {
      reject('[Child Process Error]' + d); // eslint-disable-line
    });

    if (!test) {
      resolve(child);
    }
  });
};

