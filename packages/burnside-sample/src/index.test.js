import {expect} from 'chai';
const {Burnside} = window;

Burnside.configure({
  timeout: 2000
});

describe('The Burnside Sample CLI Sample Test', function burnsideProxy() {
  it('should enable a Burnside test with the Burnside-DOM function waitForElement against any website', function remoteHostTest() {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/index.html'
    })
      .getText('h1')
      .then(value => {
        expect(value).to.equal('Hello CLI!');
      });
  });
});
