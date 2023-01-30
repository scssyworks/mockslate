const path = require('path');
const fs = require('fs');

module.exports = function getCacheLocation() {
  const cwdNodeModules = path.join(process.cwd(), 'node_modules');
  let cacheFolderLocation = process.cwd();
  let cacheLocation = null;
  try {
    if (fs.existsSync(cwdNodeModules)) {
      cacheFolderLocation = cwdNodeModules;
    }
    cacheLocation = path.join(cacheFolderLocation, '.cache');

    if (cacheLocation && !fs.existsSync(cacheLocation)) {
      fs.mkdirSync(cacheLocation);
    }
    const cachePath = path.join(cacheLocation, 'mockslate');
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath);
    }
    return cachePath;
  } catch (e) {}
  return null;
};
