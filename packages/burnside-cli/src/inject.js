import {Burnside} from '@nike/burnside';
import BurnsideDOM from '@nike/burnside-dom';

Burnside.configure({
  injectClient: false,
  extensions: [BurnsideDOM]
});

window.Burnside = Burnside;
