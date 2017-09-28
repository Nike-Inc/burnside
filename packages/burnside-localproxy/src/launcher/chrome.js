import {PACPath} from '../constants.js';
import launcherModule from 'karma-chrome-launcher';
const chromeLauncher = launcherModule['launcher:Chrome'][1];

export default class BurnsideChrome extends chromeLauncher {
  constructor(baseBrowserDecorator, args) {
    args.flags = args.flags || [];
    args.flags.push('--ignore-certificate-errors');
    args.flags.push('--proxy-pac-url=file://' + PACPath);
    super(baseBrowserDecorator, args);
  }
}
