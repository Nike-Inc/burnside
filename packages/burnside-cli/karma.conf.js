module.exports = function karmaConfig(config) {
  config.set({
    plugins: [
      require('burnside-localproxy'),
      'karma-*'
    ],
    logLevel: config.LOG_DEBUG,
    frameworks: ['mocha', 'burnside-localproxy'],
    singleRun: true, // just run once by default
    basePath: process.cwd(),
    files: [],
    reporters: [ 'mocha', 'html', 'junit' ], // report results in this format
    mochaReporter: {
      output: 'autowatch'
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
