const qs = require('qs');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const getCacheLocation = require('./getCacheLocation');
const EventEmitter = require('events');
const { log } = require('../logging');
const { isEmptyObject, isObject } = require('../utils');

let inMemoryCache = {};
const removeFromCacheEntries = [];
const cacheLocation = getCacheLocation();
const cacheEmitter = new EventEmitter();
let cachePromise = new Promise((resolve, reject) => {
  cacheEmitter.on('success', () => resolve(inMemoryCache)).on('error', reject);
});

module.exports = {
  cacheEmitter,
  cache(content, filePath) {
    const { httpRequest, httpResponse } = content || {};
    if (isObject(httpRequest)) {
      const {
        method,
        path,
        body = {},
        queryStringParameters = {},
      } = httpRequest;
      let code = 200;
      if (isObject(httpResponse)) {
        const { status = 200, statusCode = 200 } = httpResponse;
        code = status || statusCode;
      }
      if (
        typeof method === 'string' &&
        method.trim() &&
        typeof path === 'string' &&
        path.trim()
      ) {
        const cacheKey = `${method} ${path} c:${code} qs:${qs.stringify(
          queryStringParameters
        )} body:${qs.stringify(body)}`.trim();
        if (!(cacheKey in inMemoryCache)) {
          log(`Expectation added: ${cacheKey}`);
        }
        inMemoryCache[cacheKey] = filePath;
      }
    }
    return content;
  },
  setCache(cache) {
    inMemoryCache = cache;
  },
  getCache() {
    return inMemoryCache;
  },
  isCacheEmpty(cache) {
    if (isObject(cache)) {
      return isEmptyObject(cache);
    }
    return isEmptyObject(inMemoryCache);
  },
  waitForCache() {
    return cachePromise;
  },
  removeFromCache(cacheEntry) {
    removeFromCacheEntries.push(cacheEntry);
  },
};

function dumpCache() {
  removeFromCacheEntries.forEach((entry) => {
    // rome-ignore lint/performance/noDelete: Key must not exist when cache is dumped to reduce cache size
    delete inMemoryCache[entry];
  });
  const cacheFile = `${uuid()}.json`;
  fs.writeFileSync(
    path.join(cacheLocation, cacheFile),
    JSON.stringify(inMemoryCache)
  );
  log('Cache written to disk: ', cacheFile);
  cachePromise = null;
  process.exit(0);
}
process
  .on('SIGINT', dumpCache)
  .on('SIGQUIT', dumpCache)
  .on('SIGTERM', dumpCache);
