const { loadExpectations } = require('../../modules/load-expectations');
const { log } = require('../../modules/logging');

module.exports = function listener(port) {
  return () => {
    log(`Server is listening on ${port}`);
    log('Warming up cache...');
    loadExpectations();
    log('Expectations are ready!');
  };
};
