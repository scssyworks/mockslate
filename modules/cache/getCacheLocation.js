const path = require('path');
const { exists, makeDir } = require('../utils');
const { handler } = require('../utils/handler');

module.exports = function getCacheLocation() {
  return handler(() => {
    const cacheLocation = path.join(
      process.cwd(),
      'node_modules',
      '.cache',
      'mockslate'
    );
    if (!exists(cacheLocation)) {
      makeDir(cacheLocation);
    }
    return cacheLocation;
  }, null);
};
