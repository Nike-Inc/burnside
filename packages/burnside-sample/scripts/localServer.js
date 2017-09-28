var createExpressHttpServer = function createExpressHttpServerFn(args, config, logger) {
  var log = logger.create('http.server');

  // This example uses a local Express instance to stand in for your Development server
  // Replace these lines with your Application to have Karma start it automatically.
  var express = require('express');
  var app = express();
  var port = 5678;

  log.info('Local Server Running on Port', port);

  app.get('/example', function middleware(req, res) {
    res.status(200).send('<html><head></head>foo</html>');
  });

  app.listen(port);

  log.info('*** Replace this Mock Server with the Application under test ***');
};

module.exports = {
  'framework:localServer': ['factory', createExpressHttpServer]
};
