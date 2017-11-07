import path from 'path';

const packageName = 'burnside-localproxy';
const swooshPath = path.resolve(__dirname, '../kitten.jpg');
const certPath = path.resolve(__dirname, '../certs/');
const PACPath = path.resolve('./node_modules/.compiled.pac');

export {
  packageName,
  PACPath,
  certPath,
  swooshPath
};
