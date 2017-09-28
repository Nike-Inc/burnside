module.exports.Client = function client() {
  window.BurnsideModules = Object.assign({}, window.BurnsideModules, {
    parseFn: (serialized) => {
      return (new Function('return ' + JSON.parse(serialized).src + ';')());
    }
  });
  window.addEventListener('message', function receiveMessage(event) {
    if (event.data.source === 'client' || !event.data.classification) {
      return;
    }
    try {
      event.preventDefault();
      var data = event.data;
      var args = data.args || [];
      var fn = data.fn ? window.BurnsideModules.parseFn(data.fn) : () => {};
      var postBack = function postBackFn(result) {
        if (result) {
          data.fnResult = JSON.stringify(result);
        }
        parent.postMessage(Object.assign({source: 'client'}, data), '*');
      };
      var catchError = function catchErrorFn(e) {
        data.error = e.stack ? {name: e.name, stack: e.stack && e.stack.toString(), message: e.message} : e.toString();
        postBack();
      };
      Promise.resolve(fn.apply(this, args))
        .then(postBack, catchError);
    } catch (e) {
      catchError(e);
    }
  }, false);
};
