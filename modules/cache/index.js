const { formatCacheKey, formatRequestBody } = require('./formatCacheKey');

module.exports = {
  formatCacheKey,
  formatRequestBody,
  ...require('./cache'),
};
