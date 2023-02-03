const path = require('path');
const { exists, makeDir } = require('../utils');

module.exports = function getCacheLocation() {
  try {
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
  } catch (e) {}
  return null;
};
