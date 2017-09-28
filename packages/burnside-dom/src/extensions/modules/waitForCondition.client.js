module.exports.default = function waitForCondition() {
  var watchList = [];

  const check = () => {
    watchList.forEach((watch, index) => {
      var result = watch.fn(watch.args);
      if (result) {
        // clear the timeout set from waitForIt below
        window.clearTimeout(watch.timeoutId);

        if (watchList && watchList[index]) {
          watchList.splice(index, 1);
        }

        watch.resolve(result);
      }
    });
  };

  this.wait = (args, fn, timeout) => {
    return new Promise((resolve, reject) => {
      var id = window.BurnsideModules.domUtil.guid();

      var timeoutId = setTimeout(() => {
        reject(new Error('[Timeout ' + (timeout || 1000) + 'ms] Function failed to resolve:' + fn.toString()));
        watchList = watchList.filter((watchItem) => {
          return watchItem.id !== id;
        });
      }, timeout || 1000);

      watchList.push({id: id, args: args, fn: fn, resolve: resolve, reject: reject, timeoutId: timeoutId});
      check();
    });
  };

  const watchTimer = window.setInterval(check, 50);
  window.addEventListener('beforeunload', () => {
    window.clearInterval(watchTimer);
  });
};
