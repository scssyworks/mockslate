const getCacheLocation = require('./getCacheLocation');
const path = require('path');
const { getFileTimestamp, deleteFile, readDir, readJSON } = require('../utils');
const { handler } = require('../utils/handler');

const cacheLocation = getCacheLocation();

function getTimestamp(file) {
  return getFileTimestamp(path.join(cacheLocation, file));
}

function deleteOldCaches(oldCaches) {
  if (oldCaches.length) {
    oldCaches.forEach((oldCache) =>
      deleteFile(path.join(cacheLocation, oldCache))
    );
  }
}

module.exports = function getExistingCache() {
  return handler(() => {
    let inMemoryCache = null;
    const caches = readDir(cacheLocation);
    caches.sort((c1, c2) => getTimestamp(c2) - getTimestamp(c1));
    if (caches.length) {
      const [latestCache, ...oldCaches] = caches;
      const oldCachesLength = oldCaches.length;
      const latestCacheTimestamp = getTimestamp(latestCache);
      if (Date.now() - latestCacheTimestamp > 24 * 60 * 60 * 1000) {
        oldCaches.push(latestCache);
      }
      const oldCachesLengthAfterValidation = oldCaches.length;
      deleteOldCaches(oldCaches);
      if (oldCachesLengthAfterValidation === oldCachesLength) {
        inMemoryCache = readJSON(path.join(cacheLocation, latestCache));
      }
    }
    return inMemoryCache;
  }, null);
};
