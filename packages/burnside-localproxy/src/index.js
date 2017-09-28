var proxy = require('./proxy').default;
var launchers = require('./launcher').default;

launchers.chrome.$inject = ['baseBrowserDecorator', 'args'];
launchers.firefox.$inject = ['id', 'baseBrowserDecorator', 'args'];
proxy.$inject = ['args', 'config', 'logger'];

module.exports = {
  'framework:burnside-localproxy': ['factory', proxy],
  'launcher:burnside-chrome': ['type', launchers.chrome],
  'launcher:burnside-firefox': ['type', launchers.firefox],
  proxy: proxy
};
