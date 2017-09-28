var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Burnside = require('burnside').Burnside;
var c = require('burnside').constants;
var DOMExtensions = require('./index.js');

chai.use(chaiAsPromised);
chai.should();

var burnside;
var loadOpts = {
  host: 'http://localhost:' + window.location.port,
  path: '/base/resources/index.html',
  extensions: [DOMExtensions]
};

Burnside.configure(loadOpts);

describe('burnside with burnside-dom', () => {
  beforeEach(() => {
    burnside = new Burnside();
  });

  it('load should return a Promise that resolves to a Burnside object', function load() {
    return burnside;
  });

  it('should wait until the element exists before resolving', () => {
    return burnside.waitForElement('#fooBar');
  });

  it('should return a human readable error message when throwing a native error', () => {
    return burnside.waitForElement(1)
      .should.eventually.be.rejectedWith('SyntaxError: Failed to execute \'querySelector\' on \'Document\': \'1\' is not a valid selector.');
  });

  it('should reject within the timeout when the selector doesn\'t exist', () => {
    return burnside.waitForElement('#fake', 5)
      .should.eventually.be.rejectedWith('Error: Timeout: DOM Object for the selector: "#fake" not found within page before 5ms');
  });

  it('should wait until the element exists before resolving', () => {
    return burnside.exists('#fooBar');
  });

  it('should wait and then retrieve the text of the selector', () => {
    return burnside.getText('#fooBar')
      .should.eventually.equal('fooBarKungFu');
  });

  it('should wait and then retrieve the HTML of the selector', () => {
    return burnside.getHTML('#body')
      .should.eventually.contain('<h1>HTML Ipsum Presents</h1>');
  });

  it('should wait and then retrieve the attribute of the selector', () => {
    return burnside.getAttribute('#aboutLink', 'href')
      .should.eventually.contain('about.html');
  });

  it('should check the attribute of the selector, set it, and then verify it has changed', () => {
    return burnside
      .getAttribute('#aboutLink', 'href')
      .value((val) => {
        chai.expect(val).to.equal('about.html');
      })
      .setAttribute('#aboutLink', 'href', 'foo.html')
      .getAttribute('#aboutLink', 'href')
      .should.eventually.contain('foo.html');
  });

  it('should wait and then retrieve the property of the selector', () => {
    return burnside.getProperty('#body', 'id')
      .should.eventually.equal('body');
  });

  it('should check, set, and then validate the property of the selector', () => {
    return burnside
      .getProperty('#body', 'id')
      .value((val) => {
        chai.expect(val).to.equal('body');
      })
      .setProperty('#body', 'id', 'bodyFoo')
      .waitForElement('#bodyFoo');
  });

  it('should wait and then retrieve the count of the elements of the selector', () => {
    return burnside.countElements('button')
      .should.eventually.equal(3);
  });

  it('should wait for the selector to be visible before resolving', () => {
    return burnside.visible('#body');
  });

  it('should wait for the selector to be visible before rejecting', () => {
    return burnside.visible('#hiddenDiv')
      .should.eventually.be.rejectedWith(c.TIMEOUT_ERROR);
  });

  it('should wait for the selector to not be visible before resolving', () => {
    return burnside.notVisible('button.ghost');
  });

  it('notVisible should resolve when passed a selector that doesn\'t resolve', () => {
    return burnside.notVisible('.fakeSelector');
  });

  it('should wait for the selector to be not visible before rejecting', () => {
    return burnside.notVisible('#body')
      .should.eventually.be.rejectedWith(c.TIMEOUT_ERROR);
  });

  it('should use the new Burnside to set a form value, click the button, and validate the click event handler fired', () => {
    const expectedText = 'expectedText';
    return burnside
        .setFormValue('input', expectedText)
        .click('#exampleButton')
        .exists('#' + expectedText);
  });

  it('should wait for jquery to be loaded before resolving', () => {
    burnside.options.timeout = 2000; // extend the default timeout for long loading jquery
    burnside.options.injects = ['http://localhost:' + window.location.port + '/base/resources/jquery.js'];
    return burnside
      .waitForCondition(['$'], (jquery) => {
        return !!window[jquery];
      }, 1000)
      .should.eventually.equal(true);
  });

  it('should timeout waiting to be loaded before rejecting', () => {
    const nevermore = () => {return false;};
    return burnside
        .waitForCondition([], nevermore, 200)
        .should.eventually.be.rejectedWith(c.TIMEOUT_ERROR);
  });
});
