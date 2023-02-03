const getCacheLocation = require('./getCacheLocation');
const path = require('path');
const args = require('../arguments');
const { error } = require('../logging');
const { getFileTimestamp, deleteFile, readDir, readJSON } = require('../utils');

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
  try {
    const caches = readDir(cacheLocation);
    caches.sort((c1, c2) => getTimestamp(c2) - getTimestamp(c1));
    const [latestCache, ...oldCaches] = caches;
    const latestCacheTimestamp = getTimestamp(latestCache);
    const oldCachesLength = oldCaches.length;
    if (Date.now() - latestCacheTimestamp > 24 * 60 * 60 * 1000) {
      oldCaches.push(latestCache);
    }
    const oldCachesLengthAfterValidation = oldCaches.length;
    deleteOldCaches(oldCaches);
    let inMemoryCache = null;
    if (oldCachesLengthAfterValidation === oldCachesLength) {
      inMemoryCache = readJSON(path.join(cacheLocation, latestCache));
    }
    return inMemoryCache;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return null;
  }
};
