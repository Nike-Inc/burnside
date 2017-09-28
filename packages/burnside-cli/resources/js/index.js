
function runCode(e) {
  const Burnside = parent.Burnside;
  const script = document.getElementById(e.target.dataset.editor).innerText;

  var burnside = new Burnside({
    host: 'http://localhost:' + window.location.port,
    path: '/base/resources/index.html',
    timeout: 99999
  });

  const output = document.getElementById(e.target.dataset.outputid);

  try {
    eval(script); // eslint-disable-line
  } catch (err) {
    output.innerText = 'Failure with error:' + err.message;
  }

  burnside
    .then((result) => {
      if (typeof result !== 'string') {
        result = JSON.stringify(result); // eslint-disable-line
      }
      if (e.target.dataset.output === result) {
        output.innerText = 'Success!';
        output.classList.add(e.target.dataset.outputid + '_success');
      } else {
        output.innerText = 'Failure: ' + result;
      }

      return result;
    }, (error) => {
      output.innerText = 'Failure with error:' + error.message;
    });

  e.preventDefault();
}

document
  .querySelectorAll('button.run')
  .forEach((button) => {
    button.onclick = runCode;
  });
