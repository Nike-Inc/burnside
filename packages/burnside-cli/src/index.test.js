import chai from 'chai';
const {Burnside} = window;

Burnside.configure({timeout: 1000});

describe('The Burnside CLI', function burnsideProxy() {
  it('should enable a Burnside test using the DOM extensions against localhost', function localhostTest() {
    return new Burnside({
      host: 'http://localhost:' + window.location.port,
      path: '/base/resources/index.html'
    }).getText('h1').then(val => {
      chai.expect(val).to.equal('HTML Ipsum Presents');
    });
  });
});
