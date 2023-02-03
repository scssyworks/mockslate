const { v4: uuid } = require('uuid');
const path = require('path');
const getCacheLocation = require('./getCacheLocation');
const EventEmitter = require('events');
const { log, info } = require('../logging');
const {
  isObject,
  toQS,
  deleteKey,
  writeJSON,
  formatMessage,
} = require('../utils');
const { events, codes, messages } = require('../../config/constants');

let inMemoryCache = {};
const requestCache = {};
const removeFromCacheEntries = [];
const cacheLocation = getCacheLocation();
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
      const {
        method,
        path,
        body = {},
        queryStringParameters = {},
      } = httpRequest;
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
        const cacheKey = `${method} ${path.split('?')[0]} c:${code} qs:${toQS(
          queryStringParameters
        )} body:${toQS(body)}`.trim();
        if (!(cacheKey in inMemoryCache)) {
          log(formatMessage(messages.EXP_ADDED, [cacheKey]));
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

function dumpCache() {
  removeFromCacheEntries.forEach((entry) => {
    deleteKey(inMemoryCache, entry);
  });
  writeJSON(path.join(cacheLocation, `${uuid()}.json`), inMemoryCache);
  cachePromise = null;
  process.exit(0);
}
process
  .on('SIGINT', dumpCache)
  .on('SIGQUIT', dumpCache)
  .on('SIGTERM', dumpCache);
