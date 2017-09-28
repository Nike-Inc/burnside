/* global Promise:false */
/* global sinon:false */
/* global expect:false */

var Promise = require('bluebird');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var BurnsideLibrary = require('./index.js');
var Burnside = require('./index.js').Burnside;
var burnsideActions = require('./index.js').burnsideActions;
var c = require('./index.js').constants;

var middlewareSpy = sinon.spy();

var testMiddlware = () => {
  return (next) => {
    return (action) => {
      if (typeof action !== 'function') {
        middlewareSpy(action.type);
      }
      next(action);
    };
  };
};

chai.use(chaiAsPromised);
chai.should();

var loadOpts = {
  host: 'http://localhost:' + window.location.port,
  path: '/base/resources/index.html',
  middlewares: [testMiddlware],
  timeout: 5000
};

Burnside.configure(loadOpts);

describe('The Burnside Library', () => {
  it('should export Burnside, the Client, and the list of Actions', function libraryCheck() {
    expect(BurnsideLibrary).to.have.property('Client');
    expect(BurnsideLibrary.Client).to.have.property('Client');
    expect(BurnsideLibrary.Client).to.have.property('fetchInject');
    expect(BurnsideLibrary.Client).to.have.property('wrapClient');

    expect(BurnsideLibrary).to.have.property('Burnside');
    expect(BurnsideLibrary).to.have.property('burnsideActions');
  });
});

describe('Burnside', () => {
  var burnside;

  beforeEach(() => {
    burnside = new Burnside();
  });

  it('load should return a Promise that resolves to a Burnside object', function load() {
    return burnside;
  });

  it('should run the given function with the appropriate arguments inside the test frame', () => {
    return burnside.exec(['h1'], function execExample(selector) {
      return document.querySelector(selector).innerHTML;
    }).should.eventually.equal('HTML Ipsum Presents');
  });

  it('should wait until the function returns the expected object', () => {
    const foo = {foo: 'bar', thing: 2};
    return burnside
      .exec([foo], function delayedAction(value) {
        window.setTimeout(function toggleValue() {
          window._hidden_value = value;
        }, 30);
      })
      .wait([], function waitExample() {
        return window._hidden_value;
      }, foo)
      .should.eventually.deep.equal(foo);
  });

  it('should timeout waiting for something that never returns', () => {
    return new Burnside({timeout: 50})
      .wait([], () => false, true)
      .should.be.rejectedWith(c.TIMEOUT_ERROR);
  });

  it('should pause when debugging is needed', () => {
    const shortTimeout = 1;
    burnside.options.timeout = shortTimeout;
    return burnside
      .park()
      .should.be.rejectedWith(c.TIMEOUT_ERROR + shortTimeout + 'ms');
  });

  it('should output a specific warning when multiple park functions are invoked across all tests', () => {
    const totalPark = 151; // the default of 1 from the above test plus 150 from this one (this warning is culmulative)
    var spy = sinon.spy(console, 'warn');
    return burnside
      .park(100)
      .park(50)
      .then(() => {
        return new Promise(resolve => {
          window.setTimeout(() => {
            expect(spy.args[0][0]).to.contain(c.PARK_WARNING + totalPark);
            spy.restore();
            resolve();
          }, c.PARK_WARNING_TIMEOUT + 100);
        });
      });
  });

  it('should return a primitive as a primitive (not a string)', () => {
    return burnside.exec([], function returnAPrimitive() {
      return 1;
    })
    .then(number => {
      expect(number).to.equal(1);
    });
  });

  it('should throw errors from the client', () => {
    return burnside.exec([], function throwError() {
      throw new Error('Simulated Page State Error');
    }).should.eventually.be.rejectedWith('Simulated Page State Error');
  });

  it('should invoke then within the test frame with the content of the previous function', () => {
    const privateTestVariable = 'bar';
    return burnside.value(() => {
      return privateTestVariable;
    }).should.eventually.equal(privateTestVariable);
  });

  it('should be able to use a single function', () => {
    const expectedText = 'foo';
    burnside.use(function createClick(text) {
      this.exec([text], function createClickClient(t) {
        document.querySelector('input').value = t;
        document.querySelector('#exampleButton').click();
        return document.querySelector('#' + t);
      });
    });

    return burnside.createClick(expectedText);
  });

  it('should support the clientside use format', () => {
    const expectedText = 'foo';
    burnside.use(function createClick(value) {
      return {
        args: [value],
        fn: (t) => {
          document.querySelector('input').value = t;
          document.querySelector('#exampleButton').click();
          return document.querySelector('#' + t);
        }
      };
    });

    return burnside.createClick(expectedText);
  });

  it('should be able to use a single named function that returns an object', () => {
    burnside.use(() => {
      return {
        fn: () => {
          return document.querySelector('#aboutLink').href;
        }
      };
    }, 'fetchAboutLink');

    return burnside.fetchAboutLink()
      .should.eventually.have.string('about.html');
  });

  it('should be able to use an anonymous function bound to the test scope with the default name \'custom\'', () => {
    const useError = () => {
      burnside.use(() => {
        return {
          args: [],
          fn: () => {
            return document.querySelector('h1').innerHTML;
          }
        };
      });
    };

    chai.expect(useError).to.throw('Extensions must be named. If you\'re using an anonymous function, specify its name as the second parameter.');
    return burnside;
  });

  it('should be able to use a single extension', () => {
    burnside.use({
      functions: {
        fetchHeader: function fetchHeader() {
          this.exec([], () => {
            return document.querySelector('h1').innerHTML;
          });
        }
      }
    });

    return burnside.fetchHeader()
      .should.eventually.equal('HTML Ipsum Presents');
  });

  it('should be able to use a custom module with internal state', () => {
    burnside.use({
      modules: {
        timer: function timer() {
          const startTime = new Date();
          this.getDuration = () => {
            return (new Date()) - startTime;
          };
        }
      },
      functions: {
        getTime: function getTime() {
          this.exec([], () => {
            return window.BurnsideModules.timer.getDuration();
          });
        }
      }
    });

    return burnside.getTime()
      .should.eventually.be.above(1);
  });

  it('should be able to inject a third party library via CDN', () => {
    return new Burnside({
      injects: ['http://localhost:' + window.location.port + '/base/resources/sinon.js']
    }).wait([], () => {
      return Boolean(sinon);
    }, true, 10000);
  });

  it('should gracefully handle empty parameters', () => {
    return burnside.exec();
  });

  it('should gracefully handle empty parameters', () => {
    return burnside.exec(null, null);
  });

  it('should protect reserved names from custom extensions overwriting them', () => {
    chai.expect(function expectScope() {
      burnside.use({
        functions: {
          use: function foo() {
            return 'bar';
          }
        }
      });
    }).to.be.throw('Cannot set privately used variable names');
    return burnside;
  });

  it('load should ignore errors when cleaning caused by iframes that cleaned up themselves', () => {
    return burnside.then(function cleanup() {
      var frame = document.getElementsByTagName('iframe')[0];
      if (frame) {
        frame.parentNode.removeChild(frame);
      }
    });
  });

  it('should cause a warning when then is not called within a reasonable amount of time', () => {
    var warnSpy = sinon.spy(console, 'warn');
    burnside.exec([], () => {
      return window.location.href;
    });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        warnSpy.calledWith(c.NO_THEN_ERROR).should.be.true;
        warnSpy.restore();
        return burnside.then(() => resolve());
      }, 500);
    });
  });

  it('should load iframe with default viewPort in percent', () => {
    return new Burnside().then(() => {
      var el = document.querySelector('iframe');
      expect(el.getAttribute('width')).to.equal('100%', 'iframe width is not 100%');
      expect(el.getAttribute('height')).to.equal('100%', 'iframe height is not 100%');
    });
  });
});

describe('Burnside instantiation', () => {
  it('should succeed with an externally injected Client and injection turned off', () => {
    return new Burnside({ path: '/base/resources/importedClient.html', injectClient: false });
  });

  it('Burnside should generate a new iframe on each run with keepAlive mode false', () => {
    const normalBurnside = new Burnside({keepAlive: false});
    var iframeId;
    return normalBurnside.then(() => {
      iframeId = normalBurnside._iframeId;
    }).then(() => {
      return normalBurnside.then(() => {
        expect(normalBurnside._iframeId).to.not.equal(iframeId);
      });
    });
  });


  it('Burnside should reuse the same iframe with keepAlive mode equal to true', () => {
    const zombieBurnside = new Burnside({keepAlive: true});
    var iframeId;
    return zombieBurnside.then(() => {
      iframeId = zombieBurnside._iframeId;
    }).then(() => {
      return zombieBurnside.then(() => {
        expect(zombieBurnside._iframeId).to.equal(iframeId);
        zombieBurnside.close();
      });
    });
  });

  it('load should respect a custom timeout option of 1ms', () => {
    var shortTimeout = 1;
    return new Burnside({ timeout: shortTimeout })
      .should.be.rejectedWith(c.TIMEOUT_ERROR + shortTimeout + 'ms');
  });

  it('load should expose a catch method to catch errors', () => {
    return new Burnside('/doesNotExist').catch((e) => {
      chai.expect(e.message).to.equal('Error: Failed to load page via fetch. Response code: 404 Not Found');
    });
  });

  it('should run middlware', () => {
    var timeout = 100;
    middlewareSpy.reset();

    new Burnside({timeout: timeout}).exec([], () => {
      return window.location.href;
    }).then(() => {
      expect(middlewareSpy).to.be.calledWith(burnsideActions.CLIENT_INIT);
      expect(middlewareSpy).to.be.calledWith(burnsideActions.CLIENT_INIT_SUCCESS);
      expect(middlewareSpy).to.be.calledWith(burnsideActions.PAGE_LOAD_SUCCESS);
      expect(middlewareSpy).to.be.calledWith(burnsideActions.MESSAGE_POST);
      expect(middlewareSpy).to.be.calledWith(burnsideActions.MESSAGE_SUCCESS);
    });

    // Since our FINISH is called on the last then() we have to do some trickery to test it.
    // The timeout just needs to be longer than the earlier one by a short amount.
    return new Promise(resolve => {
      setTimeout(() => {
        expect(middlewareSpy).to.be.calledWith(burnsideActions.FINISH);
        resolve();
      }, timeout + 1);
    }).finally(middlewareSpy.restore);
  });

  it('should not modify the prototype of Burnside when use is invoked on an instance', () => {
    const firstBurnside = new Burnside();
    firstBurnside.use(function foo() {});

    const secondBurnside = new Burnside();
    expect(secondBurnside.foo).to.equal(undefined); // eslint-disable-line no-undefined
    return Promise.all([firstBurnside, secondBurnside]);
  });

  it('should not modify the prototype of Burnside when a customized Burnside is created', () => {
    const firstBurnside = new Burnside({extensions: [function foo() {}]}); // eslint-disable-line no-new
    const secondBurnside = new Burnside();
    expect(secondBurnside.foo).to.equal(undefined); // eslint-disable-line no-undefined
    return Promise.all([firstBurnside, secondBurnside]);
  });

  it('should avoid a warning when disable-no-then-warning rule is set', () => {
    var warnSpy = sinon.spy(console, 'warn');
    var options = {rules: {}};
    options.rules[c.RULE_DISABLE_NO_THEN] = true;
    var burnside = new Burnside(options).exec([], () => {
      return window.location.href;
    });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        warnSpy.calledWith(c.NO_THEN_ERROR).should.be.false;
        return burnside.then(() => resolve());
      }, 500);
    }).finally(warnSpy.restore);
  });

  it('should load iframe with custom viewPort dimensions', () => {
    return new Burnside({viewPort: {height: '640px', width: '480px'}}).then(() => {
      var el = document.querySelector('iframe');
      expect(el.clientWidth).to.equal(480, 'did not set custom viewPort width');
      expect(el.clientHeight).to.equal(640, 'did not set custom viewPort height');
    });
  });
});
