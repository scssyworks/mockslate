const { cacheEmitter, setCache } = require('../cache');
const { log } = require('../logging');
const getExistingCache = require('../cache/getExistingCache');
const { isEmptyObject } = require('../utils');
const { messages, events } = require('../../config/constants');
const { getExpectationDir } = require('./getExpectationDir');
const { watcher } = require('./watcher');
const { refreshExpectations } = require('./refreshExpectations');

module.exports = {
  loadExpectations() {
    const expectationsDir = getExpectationDir();
    const existingCache = getExistingCache();
    if (!isEmptyObject(existingCache)) {
      setCache(existingCache);
      cacheEmitter.emit(events.SUCCESS, existingCache);
    }
    refreshExpectations(expectationsDir);
    log(messages.SYNC);
    watcher();
  },
};
