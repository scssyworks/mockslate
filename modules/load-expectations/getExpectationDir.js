const args = require('../arguments');
const path = require('path');

module.exports = {
  getExpectationDir() {
    return path.join(process.cwd(), args.watch);
  },
};
