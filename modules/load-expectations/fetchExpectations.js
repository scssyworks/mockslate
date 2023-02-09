const path = require('path');
const { cache } = require('../cache');
const { isDir, readDir, readJSON, isEmptyObject } = require('../utils');

function fetchExpectations(dir) {
  if (isDir(dir)) {
    readDir(dir).forEach((childDir) => {
      fetchExpectations(path.join(dir, childDir));
    });
  } else {
    const fileData = readJSON(dir);
    if (!isEmptyObject(fileData)) {
      cache(fileData, dir);
    }
  }
}

module.exports = {
  fetchExpectations,
};
