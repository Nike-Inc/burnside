/* purpose: this is where we do our actual "work" */
var client = require('../Client');

var Promise = require('bluebird');
var urlParser = require('url');

function injectPage(options, iframeId) {
  options.url = urlParser.resolve(options.host, options.path);
  var iframe = document.createElement('iframe');

  return new Promise((resolve, reject) => {
    iframe.id = iframeId;
    document.body.appendChild(iframe);
    resizeIframe(iframe, options);

    iframe.onload = function iframeLoaded() {
      resolve(iframe.id);
    };

    if (options.injectClient) {
      client
        .fetchInject(options)
        .then(function setSrcDoc(src) {
          iframe.srcdoc = src;
        }, reject);
    } else {
      iframe.src = options.url;
    }
  });
}

function resizeIframe(iframe, options) {
  const viewPort = {
    height: options.viewPort && options.viewPort.height || '100%', // eslint-disable-line no-undefined
    width: options.viewPort && options.viewPort.width || '100%' // eslint-disable-line no-undefined
  };
  const html = document.documentElement;
  const body = document.body;

  iframe.width = html.style.width = body.style.width = viewPort.width;
  iframe.height = html.style.height = body.style.height = viewPort.height;
}

function removeIframe(iframeId) {
  var frame = document.getElementById(iframeId);
  try {
    frame.parentNode.removeChild(frame);
  } catch (e) {
    // already cleaned up
  }
}

function stringifyFn(fn) {
  // eslint-disable-next-line no-new-func
  return JSON.stringify({ src: (fn || new Function()).toString() });
}

function post(iframeId, id, classification, fn, args) {
  document.getElementById(iframeId).contentWindow.postMessage({
    iframeId: iframeId,
    id: id,
    classification: classification,
    fn: stringifyFn(fn),
    args: args
  }, '*');
}

module.exports = {
  injectPage: injectPage,
  removeIframe: removeIframe,
  post: post
};
