## Burnside API docs

### Core API

#### Access the Burnside Object

The CLI will configure Burnside and place it on the `window`
```js
const Burnside = window.Burnside;
```

Alternatively you can `install` and `import` Burnside directly
```bash
$ npm install --save-dev 'burnside';
```
```js
import {Burnside} from 'burnside';

const burnside = new Burnside({
  host: 'http://localhost:3000',
  path: '/index.html'
});
```

#### `exec(args, fn, timeout)`
> `exec` is the main public function of Burnside. `exec` runs `fn(args)` inside the Page you've loaded and returns the result as a Promise.

```js
burnside.exec(['.header'], selector => {
  // everything within this function is run within the Page under test
  return document.querySelector(selector);
});
```

#### `wait(args, fn, match, timeout, interval)`
> `wait` is an alternative to `exec` that waits for the result of `fn(args)` to equal the `match` object within the optional `timeout`, checking on a configurable `interval`

```js
burnside.wait([], () => window.location.origin, 'https://www.google.com');
```

#### `park(time)`
> `park` injects a pause into Burnside's execution list as well as a `debugger;` statement for use when debugging timing in your tests. By opening the Developer Tools in your browser, the `debugger;` statement should trigger the debugger to pause and allow you to evaluate any statement you need within the console.

> Note: Using `park` will trigger a debug mode warning in the console. To disable this warning, stop using `park` in your tests. Its meant to help you write tests, not slow them down.
```js
burnside.park(1000);
```

#### `value(fn)`
> `value` is a special function that returns the result of the last run function to the test frame for inspection

```js
const url = {bar: true};
burnside
  .exec([], () => window._secret_object)
  .value(data => {
    expect(data).to.equal(url);
  })
  .exec([] () => 'do more work')
```

### `then`
> `then` triggers Burnside to process all `exec` statements and return the resulting value.

```js
  // All Burnside functions return a Promise with a `then` function
  .then(result => {
    expect(result).to.equal(true);
  });
```

### `use`
> `use` adds functions to Burnside for reuse by your tests

```js
burnside.use(function clickWait(selector, waitTime) {

  // reuse existing burnside functions
  this.click(selector);

  // or return an object for burnside to process within the page under test
  return {
    _classification: 'exec', // optional Burnside function to run, defaults to `exec`
    args: [[waitTime], (timeout) => { // argument array to pass to Burnside
      return new Promise(resolve => { // note: Burnside will wait for the Promise to resolve
        setTimeout(resolve.bind(this), timeout);
      });
    }]
  };
});

burnside.clickWait('button.submit');

// Or pass a name
burnside.use(() => {
  this.click('button.go')
}, 'next');

burnside.next();

// Arrays are also accepted
burnside.use([extensionTheFirst, extensionTheSecond]);
```

### `configure`

> Configures Burnside, overwriting all previous settings and applying to all future instances.

```js
import {Burnside} from 'burnside';
import burnsideDOM from 'burnside-dom';
const burnsideOptions = {

  // Optional: the host and path to open and test, use this if the values are static and don't change
  host: 'http://www.example.com:3000',
  path: '/index.html',

  // disable this flag when using burnside-localproxy as it will inject the Client automatically
  injectClient: false,

   // optional - specify the display view port dimensions in ems, %, px, etc.
  viewPort: {
    height: '800px',
    width: '1200px'
  },

  // specify which set of extensions to use
  extensions: [burnsideDOM],

  // load any Redux middleware you would like Burnside to process
  middlewares: [],

  // inject script tags and then use them inside your page
  injects: [
    'https://localhost:2000/scripts/sinon.min.js',
    'https://localhost:2000/scripts/jquery.min.js'
  ]
};

// Optionally pass Burnside global configuration settings
Burnside.configure(burnsideOptions)

// Which lets you create Burnside with the default configuration
const defaultBurnside = new Burnside();

// You can also just pass the relative path if you've already configured the host
const shortcutBurnside = new Burnside('/index.html');

// Or pass the full set of options to the Constructor to override the global values for that instance only
const burnside = new Burnside(burnsideOptions);
```

### Burnside-DOM API

Burnside's DOM API is an Extension set with the following API Functions:

```js
burnside

  // waits for the `selector` to evaluate within the page under test within the optional `timeout`
  // note: `waitForElement` runs synchronously and is preferred over `waitForCondition`
  .waitForElement(selector, timeout)
  .exists(selector, timeout) //synonym for waitForElement

  // DEPRECATED: Please use the core `Burnside.wait(args, fn, match, timeout, interval)` in favor of this function
  // waits for the `fn` to return a truthy value when invoked with `args`
  // note: `fn` will be run synchronously with `args` every 50ms until it returns a value
  .waitForCondition(args, fn, timeout);

  // gets the `text` of the element selected by the `selector`
  .getText(selector, timeout)

  // gets the `innerHTML` of the element selected by the `selector`
  .getHTML(selector, timeout)

  // gets the count of the elements matching the `selector`
  .countElements(selector, timeout)

  // gets the `attribute` of the element selected by the `selector`
  .getAttribute(selector, attribute, timeout)

  // sets the `attribute` of the element selected by the `selector` to the `value`
  .setAttribute(selector, attribute, value, timeout)

  // gets the `property` of the element selected by the `selector`
  .getProperty(selector, property, timeout)

  // sets the `property` of the element selected by the `selector` to 'value'
  .setProperty(selector, property, value, timeout)

  // sets the `value` of the form input selected by `selector` and then triggers a change event
  .setFormValue(selector, value, timeout)

  // waits for a selector to achieve visibility state within the timeout
  .visible(selector, timeout)
  .notVisible(selector, timeout)

  // triggers a `click` event on the element selected by the `selector`
  .click(selector, timeout);
```

> Note: Testing in the negative is a bad proposition, use positive assertions when you can, e.g. avoid using `notVisible` which is a special case that allows an element to be missing.


#### CLI support for `./resources/` static file hosting via Karma
Burnside's CLI comes configured to host static files via Karma's simple HTTP webserver. Anything you place within the root directory's `./resources/` folder will be hosted automatically by Karma. For example a file named `./resources/index.html` would be available to test like this:

```js
return new Burnside({
  host: 'http://localhost:' + window.location.port,
  path: '/base/resources/index.html'
});
```

<a name="troubleshooting"></a>
### Troubleshooting

Error:
```
WARN: 'No test frame functionality performed with this instance of Burnside.
Please add a `.then` function block or, if using mocha, return this instance to the test runner.'
```
Resolution: make sure the `.then()` method is invoked in your test.
