var Navigator = require('../Navigator');
var Promise = require('bluebird');

/* internal utils */
var c = require('../Navigator/constants');
var privateVariables = ['modules', 'execList', 'use', 'then'];
var configuredOptions = {
  timeout: c.DEFAULT_TIMEOUT,
  injectClient: c.DEFAULT_INJECT,
  modules: {},
  extensions: [],
  middlewares: [],
  rules: {}, // disable-no-then-warning,
  keepAlive: false
};

const defaultFns = {functions: {exec, wait, park, value, close}};

function Burnside(options) {
  // if the parameter is a string, assume its the relative path, otherwise use the whole object
  this.options = Object.assign({}, configuredOptions, typeof options === 'string' ? {path: options} : options);

  this.options.middlewares.forEach((middleware) => {
    Navigator.addMiddleware(middleware);
  });

  this.execList = [];
  this.use = use;
  this.use(defaultFns);
  this.use(this.options.extensions);
  this._timer = null;

  this.then = (resolve, reject) => {
    // disable the `then` timer
    window.clearTimeout(this._timer);
    delete this._timer;

    return Promise.resolve(this.getNavigator())
      .then(resolve, reject)
      .finally(val => {
        if (!this.options.keepAlive) {
          this.close();
        }
        return val;
      });
  };
  this.catch = (fn) => {
    return this.then(null, fn);
  };

  if (!this.options.rules[c.RULE_DISABLE_NO_THEN]) {
    this._timer = window.setTimeout(function warnNoThenStatement() {
      console.warn(c.NO_THEN_ERROR); // eslint-disable-line no-console
    }, 10);
  }
}

Burnside.prototype.getNavigator = function getNavigator() {
  if (!this._navigator || this.closed) {
    this._navigator = Navigator.load(this.options);
    this._iframeId = this._navigator._iframeId;
  }
  return this._navigator;
};

function exec(args, fn, timeout) {
  this.getNavigator().exec(args, fn, timeout);
}

function close() {
  this.getNavigator().close();
  this.closed = true;
}

function wait(args, fn, match, timeout, interval) {
  this.getNavigator().wait(args, fn, match, timeout, interval);
}

function park(time) {
  this.getNavigator().park(time);
}

function value(fn) {
  this.getNavigator().value(fn);
}

function useExtFunction(name, func, context) {
  if (privateVariables.indexOf(name) > 0) {
    throw new Error('Cannot set privately used variable names');
  }

  if (!name || name.length < 1) {
    throw new Error('Extensions must be named. If you\'re using an anonymous function, specify its name as the second parameter.');
  }
  // Detect and handle the static context by modifying the prototype
  const target = context ? context : Burnside.prototype;

  target[name] = function execFn() {
    const result = func.apply(this, arguments);
    if (result) {
      const args = result.args || [];
      this.exec(args, result.fn, result.timeout);
    }
    return this;
  };
}

function useExt(extension) {
  const ext = Object.assign({}, {modules: {}, functions: {}}, extension);

  Object.assign(this.options.modules, ext.modules);

  Object
    .keys(ext.functions)
    .forEach(name => {
      useExtFunction(name, ext.functions[name]);
    });
}

function use(ext, name) {
  if (Array.isArray(ext)) {
    ext.forEach(useExt.bind(this));
  } else if (typeof ext === 'function') {
    useExtFunction(name || ext.name, ext, this);
  } else {
    useExt.apply(this, [ext]);
  }
}

function configure(options) {
  Object.assign(configuredOptions, options);
}

module.exports = Burnside;
module.exports.configure = configure;
