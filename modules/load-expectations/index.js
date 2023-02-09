const { messages } = require('../../config/constants');
const { log, error } = require('../logging');
const { formatMessage } = require('../utils');

process.on('exit', (code) => {
  if (code === 0) {
    log(messages.EXIT_0);
  } else {
    error(formatMessage(messages.EXIT_N, [code]));
  }
});

const { loadExpectations } = require('./loadExpectations');
const { refreshExpectations } = require('./refreshExpectations');

module.exports = {
  refreshExpectations,
  loadExpectations,
};
