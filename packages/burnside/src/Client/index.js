var Promise = require('bluebird');
var Client = require('./client.js').Client;

function fetchInject(options) {
  return fetch(options.url).then(function processResponse(response) {
    if (response.ok) {
      return response.text().then(function processText(text) {
        return text.replace(/<head[^\>]*>/, '$&' + wrapClient(options.injects, options.modules, options.url));
      });
    }
    return Promise.reject(new Error('Failed to load page via fetch. Response code: ' + response.status + ' ' + response.statusText));
  });
}

function wrapClient(injects, modules, url) {
  var scripts = '<base target="_blank" href="' + url + '">';

  (injects || []).forEach(inject => {
    scripts += '<scr' + 'ipt type="text/javascript" src="' + inject + '" async></sc' + 'ript>';
  });

  scripts += '<scr' + 'ipt type="text/javascript">window.BurnsideModules={};';
  Object.keys(modules).forEach((name) => {
    scripts += modules[name].toString() + ';window.BurnsideModules[\'' + name + '\'] = new ' + name + '();';
  });

  return scripts + 'var BurnsideClient = ' + Client.toString() + ';BurnsideClient();</scr' + 'ipt>';
}

module.exports = {Client, fetchInject, wrapClient};
