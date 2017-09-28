/* puprpose: expose external api */

/* external */
var immutable = require('seamless-immutable');
var redux = require('redux');
var Promise = require('bluebird');

/* internal constants */
var c = require('./constants');

/* redux */
var thunk = require('redux-thunk').default;
var app = require('./reduxApp');
var reducer = app.default;

/* actions */
var startNavigator = app.startNavigator;
var clientMessage = app.clientMessage;
var response = app.response;
var finish = app.finishUp;

/* middlware storage */
var middlwareModules = [thunk];

/* public */
module.exports.addMiddleware = function addMiddleware() {
  var args = Array.prototype.slice.call(arguments);
  args.forEach(function add(middleware) {
    // ensure that thunk is loaded last so use unshift instead of push
    middlwareModules.unshift(middleware);
  });
};

/* private utilities */
var guid = () => {
  var s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
};

function observeStore(store, selector, onChange) {
  var currentState = selector(store.getState());

  // base case - check current state first
  onChange(currentState);

  function handleChange() {
    const nextState = selector(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  return store.subscribe(handleChange);
}

function observeStoreAsPromise(store, selectorFn, storePromiseHandler) {
  var cancelSub;
  return new Promise(function getFrame(resolve, reject) {
    cancelSub = observeStore(store, selectorFn,
      function onChangeFn(data) {
        storePromiseHandler(data, resolve, reject);
      });
  }).finally(function cleanUp() {
    cancelSub();
  });
}

// This util is similar to ramda's whereEq functionality - http://ramdajs.com/docs/#whereEq
// however not written as a curried function.
function whereEq(spec, testObj) {
  function isEvery(pred, array) {
    return array.map(pred).reduce(function every(a, b) {
      return a && b;
    });
  }
  function identity(x) { return x; }
  var isEveryTrue = isEvery.bind(null, identity);

  var mappedKeys = Object.keys(spec).map(key => (
    testObj.hasOwnProperty(key) && spec[key] === testObj[key]
  ));

  return isEveryTrue(mappedKeys);
}

/* exported interface */
module.exports.load = function loadFn(options) {
  var store = getStore();
  var opts = Object.assign({timeout: c.DEFAULT_TIMEOUT, injectClient: true}, options);

  return new Navigator(opts, store);
};

/* super private */
var _store;

/* private */
function getStore() {
  if (_store) {
    return _store;
  }
  var initialState = immutable.from(c.INITIAL_STATE);
  var middlewares = redux.applyMiddleware.apply(this, middlwareModules);
  _store = redux.createStore(reducer, initialState, middlewares);
  // setup message bus listener
  window.addEventListener('message', function processMessagefn(m) {
    if (m.data.source === 'client') {
      _store.dispatch(response(m.data));
    }
  }, false);

  return _store;
}

/* @private */
function framesFilter(state) {
  return state.frames;
}

/* @private */
function messageFilter(state) {
  return state.messages;
}

/* @private */
function waitForIframeReady(timeout, store, iframeId) {
  return observeStoreAsPromise(store, framesFilter, function promiseCallbackHandler(frames, resolve, reject) {
    const frame = frames[iframeId] || {};
    var error = frame.error;
    if (Boolean(error)) {
      reject(new Error(error));
    }

    var success = (frame.pageLoad === true);
    if (success) {
      resolve();
    }
  }).timeout(timeout, c.TIMEOUT_ERROR + timeout + 'ms');
}

/* @private */
// easy to manage store subscription with observeStoreAsPromise
function enforceMessageReceipt(timeout, store, partialObj, errorMsg) {
  return observeStoreAsPromise(store, messageFilter, function promiseCallbackHandler(messages, resolve, reject) {
    var message = messages.find(function findFn(matchObj) {
      return Boolean(matchObj.classification) && whereEq(partialObj, matchObj);
    });
    if (message) {
      if (message.error) {
        var error = Object.assign(new Error(), message.error);
        reject(error);
      }
      resolve(message);
    }
  }).timeout(timeout, (errorMsg || c.TIMEOUT_ERROR) + timeout + 'ms');
}

/* @public */
function thenFn(onResolved, onRejected) {
  this._promise = this._promise.then(onResolved, onRejected);
  return this;
}

function getFnResult(message) {
  var result = message.fnResult;
  try {
    result = JSON.parse(result);
  } finally {
    return result;
  }
}

/* @public */
function closeFn() {
  this._store.dispatch(finish(this._iframeId));
}

/* @public */
function execFn(args, fn) {
  var id = guid();
  var self = this;

  return this.then(function then() {
    self._store.dispatch(clientMessage(self._iframeId, id, c.classification.EXEC, fn, args));
    return enforceMessageReceipt(self._options.timeout, self._store, {iframeId: self._iframeId, id: id})
      .then(getFnResult);
  });
}

/* @public */
function waitFn(args, fn, match, timeout = this._options.timeout, interval = this._options.interval) {
  const iframeId = this._iframeId;
  const id = guid();
  const matchStr = JSON.stringify(match);
  return this.then(function then() {
    return waitForState(id, iframeId, args, fn, matchStr, timeout, interval);
  });
}

function waitForState(id, iframeId, args, fn, matchStr, timeout, interval) {
  const store = getStore();

  var heartbeatTimer = window.setInterval(() => {
    // interval can outlast the frame so do a sanity check first
    if (document.getElementById(iframeId)) {
      store.dispatch(clientMessage(iframeId, id, c.classification.WAIT, fn, args));
    }
  }, (interval || c.DEFAULT_INTERVAL));

  store.dispatch(clientMessage(iframeId, id, c.classification.WAIT, fn, args));

  return Promise.resolve(enforceMessageReceipt(timeout, store, {
    iframeId,
    id,
    classification: c.classification.WAIT,
    fnResult: matchStr
  }).then((data) => {
    window.clearInterval(heartbeatTimer);
    return data;
  }).then(getFnResult));
}

/* @public */
function valueFn(fn) {
  return this.then(function then(result) {
    return fn(result);
  });
}

// put the park timer on the test window to make it global
let parkTimer;
let parkTotal = 0;

function setParkWarning(time) {
  // reset the warning timer its already been set to avoid spamming the tester
  if (parkTimer) {
    window.clearTimeout(parkTimer);
  }
  parkTimer = setTimeout(() => {
    console.warn(c.PARK_WARNING + parkTotal + 'ms'); // eslint-disable-line no-console
    // use the greater of the default delay or the combined total to stay ahead of long parks
  }, Math.max(c.PARK_WARNING_TIMEOUT, parkTotal + 100));

  parkTotal += time;
}

/* @public */
function parkFn(time = 1) {
  setParkWarning(time);
  return this.exec([time],
    /* istanbul ignore next */
    (t) => {
      return new Promise(resolve => {
        // Welcome to Burnside debug mode!
        debugger; // eslint-disable-line no-debugger
        setTimeout(resolve.bind(this), t);
      });
    });
}

/* class */
function Navigator(options, store) {
  this._store = store;
  this._iframeId = guid();
  this._options = options;
  this._promise = waitForIframeReady(this._options.timeout, this._store, this._iframeId).then(() => {
    const clientPromise = enforceMessageReceipt(this._options.timeout, this._store, {
      iframeId: this._iframeId,
      classification: c.classification.INIT
    }, c.LOAD_ERROR);
    this._store.dispatch(clientMessage(this._iframeId, guid(), c.classification.INIT));
    return clientPromise;
  });

  this._store.dispatch(startNavigator(this._options, this._iframeId));
  return this;
}

Navigator.prototype.then = thenFn;
Navigator.prototype.exec = execFn;
Navigator.prototype.value = valueFn;
Navigator.prototype.park = parkFn;
Navigator.prototype.wait = waitFn;
Navigator.prototype.close = closeFn;
