const { deleteFile } = require('../utils');
const path = require('path');
const { getCacheLocation } = require('./getCacheLocation');

function deleteOldCaches(oldCaches) {
  if (oldCaches.length) {
    oldCaches.forEach((oldCache) =>
      deleteFile(path.join(getCacheLocation(), oldCache))
    );
  }
}

module.exports = {
  deleteOldCaches,
};
