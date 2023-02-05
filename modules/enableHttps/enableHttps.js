const args = require('../arguments');
const path = require('path');
const { error } = require('../logging');
const { exists } = require('../utils');

let enableSSL = null;

module.exports = function enableHttps() {
  if (typeof enableSSL === 'boolean') {
    return enableSSL;
  }
  try {
    enableSSL =
      exists(path.join(process.cwd(), 'key.pem')) &&
      exists(path.join(process.cwd(), 'cert.pem'));
    return enableSSL;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return false;
  }
};
