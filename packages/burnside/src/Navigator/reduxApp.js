/* purpose: reduce, proivde simple actions that do two things
   1) setup the Navigator
   2) send and receive messages from the client
*/

var actions = require('./constants').actions;
var api = require('./api');
var c = require('./constants');

function reducer(state, action) {
  // Enable the below console logs for state tracing
  // console.log('action', action.type);
  // console.log('state', state);
  // console.log(`${action.type} -->> ${JSON.stringify(state.frames, null, 2)}`);

  switch (action.type) {
  case actions.CLIENT_INIT:
    return state.setIn(['frames', action.payload.iframeId], {
      options: action.payload.options,
      clientInit: false,
      pageLoad: false,
      complete: false,
      error: false
    });
  case actions.CLIENT_INIT_SUCCESS:
    return state
      .setIn(['frames', action.payload.iframeId, 'clientInit'], true)
      .updateIn(['messages'], function push(arr) {
        return arr.concat(action.payload);
      });
  case actions.PAGE_LOAD_SUCCESS:
    return state.setIn(['frames', action.payload.iframeId, 'pageLoad'], true);
  case actions.MESSAGE_SUCCESS:
    return state.updateIn(['messages'], function push(arr) {
      return arr.concat(action.payload);
    });
  case actions.FAILURE:
    return state.setIn(['frames', action.payload.iframeId, 'error'], action.payload.error);
  case actions.FINISH:
    return state.setIn(['frames', action.payload.iframeId, 'closed'], true);
  default:
    return state;
  }
}

function response(messageData) {
  return function responseThunk(dispatch) {
    switch (messageData.classification) {
    case c.classification.INIT:
      dispatch(clientInitSuccess(messageData));
      break;
    default:
      dispatch(clientResponse(messageData));
      break;
    }
  };
}

function startNavigator(options, iframeId) {
  return function startNavigatorThunk(dispatch) {
    dispatch(clientInit(iframeId, options));
    return api.injectPage(options, iframeId)
      .then(function thenFn(newIframeId) {
        dispatch(pageLoadSuccess(newIframeId));
      })
      .catch(function errorFn(error) {
        // TODO serialize before we get here? remove toString();
        dispatch(clientError(iframeId, error.toString()));
      });
  };
}

function clientMessage(iframeId, id, classification, fn, args) {
  return function clientMessageThunk(dispatch) {
    dispatch(message(iframeId));
    api.post(iframeId, id, classification, fn, args);
  };
}

function finishUp(iframeId) {
  return function finishUpThunk(dispatch) {
    dispatch(finish(iframeId));
    api.removeIframe(iframeId);
  };
}

function clientInit(iframeId, options) {
  return {
    type: actions.CLIENT_INIT,
    payload: {
      iframeId: iframeId,
      options: options
    }
  };
}

function clientInitSuccess(messageData) {
  return {
    type: actions.CLIENT_INIT_SUCCESS,
    payload: messageData
  };
}

function pageLoadSuccess(iframeId) {
  return {
    type: actions.PAGE_LOAD_SUCCESS,
    payload: {iframeId: iframeId}
  };
}

function message(iframeId) {
  return {
    type: actions.MESSAGE_POST,
    payload: iframeId
  };
}

function clientResponse(payload) {
  return {
    type: actions.MESSAGE_SUCCESS,
    payload: payload
  };
}

function finish(iframeId) {
  return {
    type: actions.FINISH,
    payload: {iframeId: iframeId}
  };
}

function clientError(iframeId, error) {
  return {
    type: actions.FAILURE,
    payload: {
      iframeId: iframeId,
      error: error
    }
  };
}

module.exports = {
  default: reducer,
  startNavigator: startNavigator,
  clientMessage: clientMessage,
  response: response,
  finishUp: finishUp
};
