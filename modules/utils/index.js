const { isObject, isEmptyObject, deleteKey } = require('./objects');
const {
  exists,
  readJSON,
  writeJSON,
  isDir,
  isFile,
  readDir,
  getFileTimestamp,
  deleteFile,
  makeDir,
} = require('./files');
const { toQS } = require('./qs');
const { formatMessage } = require('./format');

module.exports = {
  isObject,
  isEmptyObject,
  deleteKey,
  toQS,
  exists,
  readJSON,
  writeJSON,
  isDir,
  isFile,
  readDir,
  formatMessage,
  getFileTimestamp,
  deleteFile,
  makeDir,
};
