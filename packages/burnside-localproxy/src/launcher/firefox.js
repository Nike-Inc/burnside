import {PACPath} from '../constants.js';
import launcherModule from 'karma-firefox-launcher';
const firefoxLauncher = launcherModule['launcher:Firefox'][1];

export default class BurnsideFireFox extends firefoxLauncher {
  constructor(id, baseBrowserDecorator, args) {
    args.prefs = Object.assign({}, args.prefs, {
      'security.ssl.enable_ocsp_stapling': false,
      'network.proxy.share_proxy_settings': true,
      'network.proxy.type': 2,
      'network.proxy.autoconfig_url': 'file://' + PACPath
    });
    super(id, baseBrowserDecorator, args);
  }
}
