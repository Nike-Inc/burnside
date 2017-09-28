import path from 'path';

const packageName = 'burnside-localproxy';
const certPath = path.resolve(__dirname, '../certs/');
const PACPath = path.resolve('./node_modules/.compiled.pac');

export {
  packageName,
  PACPath,
  certPath
};
