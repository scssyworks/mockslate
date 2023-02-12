const { dumpCache, ...deps } = require('./cache');
const { formatCacheKey, formatRequestBody } = require('./formatCacheKey');

process
  .on('SIGINT', dumpCache)
  .on('SIGQUIT', dumpCache)
  .on('SIGTERM', dumpCache);

module.exports = {
  formatCacheKey,
  formatRequestBody,
  ...deps,
};
