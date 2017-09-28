var path = require('path');

module.exports = function webpackConfig(config) {
  config.set({
    browsers: [ 'Chrome' ],
    browserNoActivityTimeout: 5000,
    singleRun: true, // just run once by default
    frameworks: ['mocha', 'chai-as-promised', 'sinon-chai'],
    files: [
      'src/**/*.test.js',
      { pattern: 'resources/**/*', watched: true, included: false, served: true }
    ],
    preprocessors: {
      'src/**/*.test.js': ['webpack', 'sourcemap' ], // preprocess with webpack and our sourcemap loader,
      'resources/**/*.js': ['webpack', 'sourcemap' ] // preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'mocha', 'html', 'coverage', 'junit' ], // report results in this format
    mochaReporter: {
      output: 'autowatch'
    },
    coverageReporter: {
      dir: 'reports/coverage',
      reporters: [
        { type: 'text'},
        { type: 'lcov', subdir: '.'},
        { type: 'json', subdir: '.'},
        { type: 'json-summary', subdir: '.'},
        { type: 'text', subdir: '.', file: 'lcov.info' }
      ]
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        postLoaders: [ {
          test: /\.js$/,
          include: [path.resolve('src/'), path.resolve('util/')],
          exclude: [/\w+.test\.js/, /client/],
          loader: 'istanbul-instrumenter'
        }]
      }
    },
    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
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
    }
  });
};
