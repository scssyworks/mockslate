const getCacheLocation = require('./getCacheLocation');
const fs = require('fs');
const path = require('path');
const args = require('../arguments');
const { error } = require('../logging');

const cacheLocation = getCacheLocation();

function getFileTimestamp(file) {
  return fs.statSync(path.join(cacheLocation, file)).mtime.getTime();
}

function deleteOldCaches(oldCaches) {
  if (oldCaches.length) {
    oldCaches.forEach((oldCache) =>
      fs.unlinkSync(path.join(cacheLocation, oldCache))
    );
  }
}

module.exports = function getExistingCache() {
  try {
    const caches = fs.readdirSync(cacheLocation);
    caches.sort((c1, c2) => getFileTimestamp(c2) - getFileTimestamp(c1));
    const [latestCache, ...oldCaches] = caches;
    const latestCacheTimestamp = getFileTimestamp(latestCache);
    const oldCachesLength = oldCaches.length;
    if (Date.now() - latestCacheTimestamp > 24 * 60 * 60 * 1000) {
      // If latest cache is older than 24 hours then that is also considered old
      oldCaches.push(latestCache);
    }
    const oldCachesLengthAfterValidation = oldCaches.length;
    deleteOldCaches(oldCaches);
    let inMemoryCache = null;
    if (oldCachesLengthAfterValidation === oldCachesLength) {
      inMemoryCache = JSON.parse(
        fs.readFileSync(path.join(cacheLocation, latestCache))
      );
    }
    return inMemoryCache;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return null;
  }
};
