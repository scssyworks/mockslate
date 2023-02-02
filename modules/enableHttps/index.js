const args = require('../arguments');
const fs = require('fs');
const path = require('path');
const { error } = require('../logging');

let enableSSL = null;

module.exports = function enableHttps() {
  if (typeof enableSSL === 'boolean') {
    return enableSSL;
  }
  try {
    enableSSL =
      fs.existsSync(path.join(args.cert, 'key.pem')) &&
      fs.existsSync(path.join(args.cert, 'cert.pem'));
    return enableSSL;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return false;
  }
};
