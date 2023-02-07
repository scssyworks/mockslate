const path = require('path');
const { exists } = require('../utils');
const { handler } = require('../utils/handler');

let enableSSL = null;

module.exports = function enableHttps() {
  if (typeof enableSSL === 'boolean') {
    return enableSSL;
  }
  return handler(() => {
    enableSSL =
      exists(path.join(process.cwd(), 'key.pem')) &&
      exists(path.join(process.cwd(), 'cert.pem'));
    return enableSSL;
  }, false);
};
