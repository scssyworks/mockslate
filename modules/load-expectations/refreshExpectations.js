const { events, errors } = require('../../config/constants');
const { cacheEmitter, getCache } = require('../cache');
const { error } = require('../logging');
const { exists } = require('../utils');
const { fetchExpectations } = require('./fetchExpectations');

module.exports = {
  refreshExpectations(expectationsDir) {
    if (exists(expectationsDir)) {
      fetchExpectations(expectationsDir);
      cacheEmitter.emit(events.SUCCESS, getCache());
    } else {
      cacheEmitter.emit(events.ERROR);
      error(errors.DIR_NOT_FOUND_ERR);
    }
  },
};
