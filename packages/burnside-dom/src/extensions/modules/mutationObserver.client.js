module.exports.default = function mutationObserver() {
  var watchList = [];

  const check = () => {
    watchList.forEach((watch, index) => {
      var result = watch.find(watch.argDict);
      if (result) {
        // clear the timeout set from waitForIt below
        window.clearTimeout(watch.timeoutId);

        if (watchList && watchList[index]) {
          watchList.splice(index, 1);
        }
        // transform the result and resolve the original promise from waitForIt
        watch.resolve(watch.transform(result, watch.argDict));
      }
    });
  };

  const observer = new window.MutationObserver(check);
  observer.observe(document.documentElement, { childList: true, characterData: true, attributes: true, subtree: true });

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });

  this.wait = (argDict, find, transform) => {
    return new Promise((resolve, reject) => {
      var id = window.BurnsideModules.domUtil.guid();

      var timeoutId = setTimeout(() => {
        reject(new Error('Timeout: DOM Object for the selector: \"' + argDict.selector + '\" not found within page before ' + (argDict.timeout || 1000) + 'ms'));
        watchList = watchList.filter((watchItem) => {
          return watchItem.id !== id;
        });
      }, argDict.timeout || 1000);

      watchList.push({id: id, argDict: argDict, find: find, transform: transform, resolve: resolve, reject: reject, timeoutId: timeoutId});
      check();
    });
  };
};
