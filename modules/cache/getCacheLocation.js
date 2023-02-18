const path = require('path');
const { NM, CACHE_DIR, LIB } = require('../../config/constants');
const { exists, makeDir } = require('../utils');
const { handler } = require('../utils/handler');

module.exports = {
  getCacheLocation() {
    return handler(() => {
      const cacheLocation = path.join(process.cwd(), NM, CACHE_DIR, LIB);
      if (!exists(cacheLocation)) {
        makeDir(cacheLocation);
      }
      return cacheLocation;
    }, null);
  },
};
