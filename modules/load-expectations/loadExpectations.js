const args = require('../arguments');
const path = require('path');
const watch = require('node-watch');
const {
  cache,
  cacheEmitter,
  getCache,
  setCache,
  requestInvalidate,
} = require('../cache');
const { log, error } = require('../logging');
const getExistingCache = require('../cache/getExistingCache');
const {
  isDir,
  readDir,
  readJSON,
  isEmptyObject,
  formatMessage,
  exists,
  isFile,
  deleteKey,
} = require('../utils');
const { errors, messages, events } = require('../../config/constants');

process.on('exit', (code) => {
  if (code === 0) {
    log(messages.EXIT_0);
  } else {
    error(formatMessage(messages.EXIT_N, [code]));
  }
});

function fetchExpectations(dir) {
  if (isDir(dir)) {
    readDir(dir).forEach((childDir) => {
      fetchExpectations(path.join(dir, childDir));
    });
  } else {
    const fileData = readJSON(dir);
    if (!isEmptyObject(fileData)) {
      cache(fileData, dir);
    }
  }
}

function refreshExpectations(expectationsDir) {
  if (exists(expectationsDir)) {
    fetchExpectations(expectationsDir);
    cacheEmitter.emit(events.SUCCESS, getCache());
  } else {
    cacheEmitter.emit(events.ERROR);
    error(errors.DIR_NOT_FOUND_ERR);
  }
}

module.exports = {
  refreshExpectations,
  loadExpectations() {
    const expectationsDir = path.join(process.cwd(), args.watch);
    const existingCache = getExistingCache();
    if (!isEmptyObject(existingCache)) {
      setCache(existingCache);
      cacheEmitter.emit(events.SUCCESS, existingCache);
    }
    // expectations are refreshed regardless of cache existence however server is ready sooner
    refreshExpectations(expectationsDir);
    log(messages.SYNC);
    watch(expectationsDir, { recursive: true }, (_, filePath) => {
      filePath = filePath.trim();
      requestInvalidate(filePath);
      if (exists(filePath)) {
        if (isFile(filePath)) {
          fetchExpectations(filePath);
        }
      } else {
        const currentCache = getCache();
        const removeKeys = [];
        Object.keys(currentCache).forEach((key) => {
          if (currentCache[key].includes(filePath)) {
            removeKeys.push(key);
          }
        });
        removeKeys.forEach((key) => {
          log(formatMessage(messages.EXP_REMOVED, [key]));
          deleteKey(currentCache, key);
        });
      }
    });
  },
};
