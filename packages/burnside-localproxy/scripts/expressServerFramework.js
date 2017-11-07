var createExpressHttpServer = function createExpressHttpServerFn(args, config, logger) {
  var log = logger.create('http.server');
  log.info('Starting');
  var express = require('express');
  var app = express();

  config.expressHttpServer.server(app, log);

  app.listen(config.expressHttpServer.port);
  log.info('Done');
};

module.exports = {
  'framework:express-http-server': ['factory', createExpressHttpServer]
};
