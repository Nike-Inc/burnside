const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {Burnside, constants} = require('burnside');
const burnsideDOM = require('burnside-dom');

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

Burnside.configure({
  injectClient: false,
  extensions: [burnsideDOM],
  timeout: 5000
});

describe('The Burnside Proxy', function burnsideProxy() {
  it('should enable a Burnside test against localhost', function localhostTest() {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/index.html'
    }).exec(['h1'], function execExample(selector) {
      return document.querySelector(selector).innerHTML;
    }).should.eventually.equal('HTML Ipsum Presents');
  });

  it('should enable a Burnside test against a fragment', function localhostTest() {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/fragment.html'
    }).exec(['h1'], function execExample(selector) {
      return document.querySelector(selector).innerHTML;
    }).should.eventually.equal('HTML Ipsum Presents');
  });

  it('should enable a Burnside test with the Burnside DOM Extensions available', function remoteHostTest() {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/index.html'
    }).getHTML('h1').should.eventually.deep.equal('HTML Ipsum Presents');
  });

  it('should fail when loading a missing host', function missingHostTest() {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/missing',
      timeout: 2000
    }).should.eventually.be.rejectedWith(constants.LOAD_ERROR);
  });

  it('should be able to assert a redirected page location', () => {
    const redirected = 'http://localhost:' + window.location.port + '/base/resources/index.html';
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/redirect.html'
    })
    .click('#home_link')
    .wait([], () => window.location.href, redirected, 5000, 10)
    .should.eventually.equal(redirected);
  });

  it('should be able to inject a third party library via CDN', () => {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/index.html'
    }).wait([], () => !!window.sinon, true).should.eventually.equal(true);
  });

  it('should be able to pass custom headers to the server via configuration', () => {
    return new Burnside({
      host: 'http://localhost:5678',
      path: '/fooTest',
      timeout: 2000,
      injectClient: false
    });
  });

  it('should not interfere with POSTing data and CORS should be enabled', () => {
    // note: POSTing will fail without CORS enabled, which is being configured via .burnside-localproxyrc request header
    return window.fetch('http://localhost:5678/postTest', {
      method: 'POST',
      body: JSON.stringify({foo: 'bar'})
    }).then(response => {
      // validate that the response header was not added for POST
      // note: the header is still added for the OPTIONS check which enables CORS regardless
      expect(response.headers.get('Access-Control-Allow-Origin')).to.equal(null);
    });
  });
});
