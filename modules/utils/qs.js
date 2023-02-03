const qs = require('qs');
const { isObject } = require('./objects');

function toQS(input) {
  if (isObject(input)) {
    return qs.stringify(input);
  }
  return '';
}

module.exports = {
  toQS,
};
