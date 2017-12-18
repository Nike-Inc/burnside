import {Client} from 'burnside';
import hoxy from 'hoxy';
import fs from 'fs';
import path from 'path';
import cc from 'cosmiconfig';

import {packageName, PACPath, certPath, swooshPath} from '../constants.js';
const startMsg = 'Proxy Started';
const headRgx = /<head[^\>]*>/;

let burnsideDOM;
try {
  burnsideDOM = require.resolve('burnside-dom');
} catch (e) {
  // ignore errors
}

const defaultOptions = {
  key: certPath + '/localhost.privkey.pem',
  cert: certPath + '/localhost.cert.pem',
  replaceImages: false,
  trace: false || process.env.trace,
  injects: [],
  extensions: [burnsideDOM],
  request: {},
  response: {},
  methods: ['GET', 'OPTIONS'],
  port: 9888
};

export default function startProxy(args, karmaConf, logger) {
  findConfiguration()
    .then(function processBurnsideConfig(options) {
      var log = logger.create('Burnside Localproxy');
      log.debug('Configuration:', options);
      writePAC(options);
      init(options, log);

      if (logger) {
        log.debug(startMsg);
      } else {
        console.info(startMsg); // eslint-disable-line no-console
      }
    });
}

function findConfiguration() {
  return findConfig(packageName).then(results => {
    const localProxyConf = results ? results.config : {};
    return Object.assign(defaultOptions, localProxyConf);
  });
}

function findConfig(name) {
  return cc(name).load(process.cwd());
}

const burnsidePAC = function FindProxyForURL(url) {
  if (url.substring(0, 1).toLowerCase() !== 'h') {
    return 'DIRECT';
  }
  return 'PROXY localhost:PROXYPORT';
};

function writePAC({port}) {
  fs.writeFileSync(PACPath, burnsidePAC.toString().replace('PROXYPORT', port));
}

function init(opts, log) {
  if (opts.key && opts.cert) {
    opts.certAuthority = {
      key: fs.readFileSync(opts.key),
      cert: fs.readFileSync(opts.cert)
    };
  }
  let modules = {};
  // require in any configured extensions and merge the modules objects
  opts.extensions.forEach(ext => {
    Object.assign(modules, require(ext).modules);
  });

  // wrap up the configured values with the Client for injection
  const clientStr = Client.wrapClient(opts.injects, modules);
  var imageBinary;
  if (opts.replaceImages) {
    const fp = opts.replaceImages === true ? swooshPath : path.resolve(opts.replaceImages);
    imageBinary = fs.readFileSync(fp);
  }

  // start up our proxy server
  const proxy = hoxy.createServer(opts).listen(opts.port);

  // intercept outbound requests for setting request headers and optionally replace images for faster testing
  proxy.intercept({
    phase: 'request',
    method: (value) => {
      return opts.methods.includes(value);
    },
    as: 'buffer'
  }, function listen(req, resp) {
    const requestHeaders = opts.request.headers || {};

    // if the replaceImages flag has been set, test the request url for an image pattern and populate the response immediately
    if (opts.replaceImages && /(jpg|jpeg|png)/.test(req.url)) {
      // More information on Hoxy response population: https://greim.github.io/hoxy/#response-population
      resp.buffer = imageBinary;
      return;
    }

    Object.assign(req.headers, requestHeaders);
  });

  if (opts.trace) {
    proxy.intercept({
      phase: 'response'
    }, function trace(req) {
      log.debug('Tracing Resource Request: ', req.hostname + req.url);
    });
  }

  // clean CORS headers and inject the wrapped Client during the response phase
  proxy.intercept({
    phase: 'response',
    mimeType: /(text)/,
    method: (value) => {
      return opts.methods.includes(value);
    },
    as: 'string'
  }, function listen(req, resp) {
    delete resp.headers['x-frame-options'];

    if (resp.headers['content-type'].match(/html/)) {
      if (resp.string.match(headRgx)) {
        resp.string = resp.string.replace(headRgx, '$&' + clientStr);
      } else {
        resp.string = `${clientStr}${resp.string}`;
      }
    }

    const responseHeaders = opts.response.headers || {};
    Object
      .keys(responseHeaders)
      .forEach(name => {
        resp.headers[name] = responseHeaders[name];
      });
  });

  // squelch ENOTFOUND errors that are otherwise unhandled
  proxy.on('error', function onError(err) {
    if (err.code === 'ENOTFOUND') {
      // squelch
      return;
    }
  });
}
