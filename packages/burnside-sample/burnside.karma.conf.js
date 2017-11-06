var karmaEnvPreprocessor = require('karma-env-preprocessor');

module.exports = function configureKarma(config) {
  config.set({
    browserNoActivityTimeout: -1,
    logLevel: config.LOG_DEBUG,
    preprocessors: {
      '**/*.js': ['env']
    },
    envPreprocessor: [
      'FOO'
    ],
    plugins: [
      karmaEnvPreprocessor
    ]
  });
};
