const EventEmitter = require('events');
const { log, info } = require('../logging');
const {
  isObject,
  deleteKey,
  formatMessage,
  exists,
  writeJSON,
} = require('../utils');
const { events, codes, messages } = require('../../config/constants');
const { formatCacheKey } = require('./formatCacheKey');
const path = require('path');
const { v4: uuid } = require('uuid');
const { getCacheLocation } = require('./getCacheLocation');

const cacheLocation = getCacheLocation();

let inMemoryCache = {};
const requestCache = {};
const removeFromCacheEntries = [];
const cacheEmitter = new EventEmitter();
let cachePromise = new Promise((resolve, reject) => {
  cacheEmitter
    .on(events.SUCCESS, () => resolve(inMemoryCache))
    .on(events.ERROR, reject);
});

module.exports = {
  cacheEmitter,
  cache(content, filePath) {
    const { httpRequest, httpResponse } = content;
    if (isObject(httpRequest)) {
      const { method, path, body, queryStringParameters } = httpRequest;
      let code = codes.SUCCESS;
      if (isObject(httpResponse)) {
        const { status, statusCode } = httpResponse;
        code = status || statusCode || codes.SUCCESS;
      }
      if (
        typeof method === 'string' &&
        method.trim() &&
        typeof path === 'string' &&
        path.trim()
      ) {
        const cacheKey = formatCacheKey(
          method,
          path,
          code,
          queryStringParameters,
          body
        );
        if (cacheKey in inMemoryCache) {
          if (!exists(inMemoryCache[cacheKey])) {
            log(formatMessage(messages.EXP_UPDATED, [cacheKey]));
            inMemoryCache[cacheKey] = filePath;
          }
        } else {
          log(formatMessage(messages.EXP_ADDED, [cacheKey]));
          inMemoryCache[cacheKey] = filePath;
        }
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
  dumpCache() {
    removeFromCacheEntries.forEach((entry) => {
      deleteKey(inMemoryCache, entry);
    });
    writeJSON(path.join(cacheLocation, `${uuid()}.json`), inMemoryCache);
    process.exit(0);
  },
  waitForCache() {
    return cachePromise;
  },
  removeFromCache(cacheEntry) {
    removeFromCacheEntries.push(cacheEntry);
  },
  request(key, callback) {
    if (key in requestCache) {
      info('Response(cached):');
    } else {
      requestCache[key] = callback();
      info('Response:');
    }
    return requestCache[key];
  },
  requestInvalidate(key) {
    const currCacheKeys = Object.keys(requestCache);
    currCacheKeys.forEach((cacheKey) => {
      if (cacheKey.includes(key)) {
        deleteKey(requestCache, key);
      }
    });
  },
};
