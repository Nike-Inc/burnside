import {Burnside} from 'burnside';
import BurnsideDOM from 'burnside-dom';

Burnside.configure({
  injectClient: false,
  extensions: [BurnsideDOM]
});

window.Burnside = Burnside;
