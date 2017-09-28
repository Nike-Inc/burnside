## Architecture

Burnside's suite is comprised of multiple packages within a single repository, known colloquially as a MonoRepo. The following is a breakdown of what each package is and what it is used for.

### [Burnside](../packages/burnside/)

The core runtime is responsible for bootstrapping the Client frame, managing its communication, and the extensible API that the other packages utilize.

### [Burnside-CLI](../packages/burnside-cli/)

A CLI designed to run Burnside quickly and easily without requiring the manual setup and configuration of tools like Karma and Webpack.

Additionally includes a tutorial with a series of exercises designed to teach developers how to test with Burnside.

### [Burnside-DOM](../packages/burnside-dom/)

Burnside-DOM is an extension to Burnside that contains extends Burnside with a set of functions focused on providing easy access to the Document under test. For more detail, please visit the [API Documentation](api.md)

### [Burnside-Localproxy](../packages/burnside-localproxy/)

A stand alone Proxy that can be run in parallel with Burnside to provide easy, zero-configuration testing of any website regardless of how the server you're testing is configured. Burnside's Localproxy enables testing of any website by stripping security and injecting Burnside into every single page requested.

Implements the [Karma](https://karma-runner.github.io/1.0/index.html) Plugin API allowing for [very simple configuration](../packages/burnside-localproxy/sample.karma.config.js) with the popular testing tool.

Once installed, you can (optionally) create a file named `.burnside-localproxyrc` in your project in order to configure it to run any extensions, inject any scripts that you may need, or modify the headers being passed by the server under test.

For example:
```js
{
  "burnside-localproxy": {
    "port": 9888,
    "extensions": [
      "burnside-dom"
    ],
    "injects": [
      "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/1.15.4/sinon.min.js"
    ],
    "request": {
      "headers": {
        "secret-custom-header": "<SHARED-SECRET>"
      }
    },
    "response": {
      "headers": {
        "Access-Control-Allow-Origin": "*"
      }
    }
  }
}
```

Update your [karma.conf.js](../packages/burnside-sample/karma.conf.js) to include the following settings:
```js

browsers: ['burnside-chrome'],

plugins: ['burnside-localproxy', <list all karma-plugins, e.g. karma-mocha>],

frameworks:['burnside-localproxy', <other frameworks, e.g. mocha>],
```

### [Burnside-Extensions](../packages/burnside-extensions/)

Burnside bundles groups of functions and modules into Extensions that can be easily exported and reused. The Extensions package is a set of smaller modules and functions bundled into a single package.

> Modules are small objects which can contain scope like event listeners that add logic to Burnside's Client layer.

### [Burnside-CLI-Sample](../packages/burnside-cli-sample/)

A boilerplate project designed to provide and validate a basic configuration of Burnside using it's CLI.

### [Burnside-Sample](../packages/burnside-sample/)

A boilerplate project designed to provide and validate a manual configuration of Burnside and all of its other Packages.
