/* puprpose: a place to store shared values */
module.exports.INITIAL_STATE = {
  frames: {},
  messages: []
};

module.exports.DEFAULT_TIMEOUT = 500;
module.exports.PARK_WARNING_TIMEOUT = 500;
module.exports.DEFAULT_INTERVAL = 100;
module.exports.DEFAULT_INJECT = true;
module.exports.TIMEOUT_ERROR = 'Timeout: No response from the page within timeout ';
module.exports.LOAD_ERROR = 'Burnside **FAILED** to communicate with the Page under test within timeout ';
module.exports.NO_THEN_ERROR = 'No test frame functionality performed with this instance of Burnside.  Please add a `.then` function block or, if using mocha, return this instance to the test runner.';
module.exports.PARK_WARNING = 'Burnside is running in Debug mode via your use of Park. Please consider removing your use of SLEEP prior to committing your final tests, you could save ';
module.exports.RULE_DISABLE_NO_THEN = 'disable-no-then-warning';

module.exports.classification = {
  INIT: 'client_init',
  HANDSHAKE: 'handshake_message',
  EXEC: 'exec_message',
  WAIT: 'wait_message'
};

module.exports.CLIENT_FRAME_LOAD = 'CLIENT_FRAME_LOAD';
module.exports.actions = {
  CLIENT_INIT: 'CLIENT_INIT',
  CLIENT_INIT_SUCCESS: 'CLIENT_INIT_SUCCESS',
  PAGE_LOAD_SUCCESS: 'PAGE_LOAD_SUCCESS',

  MESSAGE_POST: 'MESSAGE_POST',
  MESSAGE_SUCCESS: 'MESSAGE_SUCCESS',

  FAILURE: 'FAILURE',
  FINISH: 'FINISH'
};
