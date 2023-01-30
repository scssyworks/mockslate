function isObject(input) {
  return input !== null && typeof input === 'object';
}

function isEmptyObject(input) {
  return !isObject(input) || Object.keys(input).length === 0;
}

module.exports = {
  isObject,
  isEmptyObject,
};
