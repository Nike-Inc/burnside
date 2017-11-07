var path = require('path');
var burnsideProxy = require('./lib/index.js');
var testExpressServer = require('./scripts/expressServerFramework.js');
var bodyParser = require('body-parser');

// configure karma with webpack
module.exports = function webpackConfig(config) {
  config.set({
    browsers: ['burnside-chrome', 'burnside-firefox'],
    browserNoActivityTimeout: 5000,
    singleRun: true, // just run once by default
    plugins: [ // explicitly list all plugins so we can inject our test server and proxy
      testExpressServer,
      burnsideProxy,
      'karma-*'
    ],
    frameworks: ['mocha', 'chai-as-promised', 'sinon-chai', 'burnside-localproxy', 'express-http-server'],
    files: [
      'src/**/*.test.js',
      { pattern: 'resources/**/*', watched: true, included: false, served: true }
    ],
    preprocessors: {
      'src/**/*.test.js': ['webpack', 'sourcemap' ],
      'resources/**/*.js': ['webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha', 'html', 'junit' ], // report results in this format
    mochaReporter: {
      output: 'autowatch'
    },
    coverageReporter: {
      dir: 'reports/coverage',
      reporters: [
        { type: 'text'},
        { type: 'lcov', subdir: '.'},
        { type: 'json-summary', subdir: '.'},
        { type: 'text', subdir: '.', file: 'lcov.info' }
      ]
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        postLoaders: [{
          test: /\.js$/,
          include: [path.resolve('lib/')],
          exclude: [/\w+.test\.js/],
          loader: 'istanbul-instrumenter'
        }]
      }
    },
    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
    },
    client: {
      mocha: {
        timeout: 5000
      }
    },
    /* reporter configs */
    htmlReporter: {
      outputDir: 'reports',
      templatePath: null,
      focusOnFailures: true,
      namedFiles: false,
      pageTitle: 'summary',
      urlFriendlyName: true,
      reportName: 'unitPrimary'
    },
    junitReporter: {
      outputDir: 'reports/unit',
      // removes the dynamic browser directory
      useBrowserName: false,
      outputFile: 'xunitPrimary.xml',
      suite: ''
    },
    expressHttpServer: {
      port: 5678,
      server: function server(app, log) {
        log.info('Mock Server Running on Port', 5678);
        app.use(bodyParser.text());

        app.get('/fooTest', function middleware(req, res) {
          if (req.headers.example !== 'foo') {
            res.status(500).send('failed test!');
          } else {
            res.status(200).send('<html><head></head>foo</html>');
          }
        });

        app.post('/postTest', function postFn(req, res) {
          const body = JSON.parse(req.body);
          res.setHeader('Content-Type', 'text/plain');
          if (body.foo === 'bar') {
            res.status(200).send(true);
          } else {
            res.status(500).send(false);
          }
        });
      }
    },
    captureTimeout: 5000
  });
};
