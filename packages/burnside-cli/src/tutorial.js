const {Burnside} = window;
const timeout = 99999999;

// remove the Karma banner
parent.document.getElementById('banner').remove();

Burnside.configure({
  timeout
});

const burnit = new Burnside({
  host: 'http://localhost:' + window.location.port,
  path: '/base/resources/tutorial.html',
  keepAlive: true
});

describe('The Burnside Tutorial should complete successfully', function burnsideProxy() {
  after(() => {
    burnit.close();
  });
  it('should successully run the exec sample', function introTest() {
    return burnit.exists('.o1_success', 99999999);
  });
  it('should successully run the wait sample', function introTest() {
    return burnit.exists('.o2_success', 99999999);
  });
  it('should successully run the use sample', function introTest() {
    return burnit.exists('.o3_success', 99999999);
  });
  it('should successully run the value sample', function introTest() {
    return burnit.exists('.o4_success', 99999999);
  });
  it('should successully run the DOM API sample', function introTest() {
    return burnit.exists('.o5_success', 99999999);
  });
  it('should only close when the final close button is clicked', function introTest() {
    return burnit.exists('.close_tutorial', 99999999);
  });
});
