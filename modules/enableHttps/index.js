const args = require('../arguments');
const fs = require('fs');
const path = require('path');
const { error } = require('../logging');

module.exports = function enableHttps() {
  try {
    return (
      fs.existsSync(path.join(args.cert, 'key.pem')) &&
      fs.existsSync(path.join(args.cert, 'cert.pem'))
    );
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return false;
  }
};
