const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Burnside = require('burnside').Burnside;
const burnsideDOM = require('burnside-dom');

chai.use(chaiAsPromised);
chai.should();

Burnside.configure({
  injectClient: false,
  extensions: [burnsideDOM],
  timeout: 20000
});

describe('The Burnside Sample Project Test', function burnsideProxy() {
  it('should enable a Burnside test with the Burnside-DOM function waitForElement against any website', function remoteHostTest() {
    return new Burnside({
      host: 'http://localhost:5678',
      path: '/example/'
    }).waitForElement('body');
  });
});
