const { loadExpectations } = require('../../modules/load-expectations');
const { log } = require('../../modules/logging');
const { formatMessage } = require('../../modules/utils');
const { messages } = require('../constants');

module.exports = function listener(port) {
  return () => {
    log(formatMessage(messages.PORT, [port]));
    log(messages.CACHE);
    loadExpectations();
    log(messages.CACHE_READY);
  };
};
