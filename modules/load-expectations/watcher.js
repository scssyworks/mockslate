const watch = require('node-watch');
const { messages } = require('../../config/constants');
const { requestInvalidate, getCache } = require('../cache');
const { log } = require('../logging');
const { exists, isFile, formatMessage, deleteKey } = require('../utils');
const { fetchExpectations } = require('./fetchExpectations');
const { getExpectationDir } = require('./getExpectationDir');

module.exports = {
  watcher() {
    watch(getExpectationDir(), { recursive: true }, (_, filePath) => {
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
