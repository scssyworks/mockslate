function isObject(input) {
  return input !== null && typeof input === 'object';
}

function isEmptyObject(input) {
  return !isObject(input) || Object.keys(input).length === 0;
}

function deleteKey(obj, key) {
  if (isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key)) {
    // rome-ignore lint/performance/noDelete: Removing key to instead of setting it to undefined to save disk space
    delete obj[key];
  }
}

module.exports = {
  isObject,
  isEmptyObject,
  deleteKey,
};
