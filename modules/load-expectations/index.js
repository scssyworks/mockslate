const args = require('../arguments');
const path = require('path');
const fs = require('fs');
const watch = require('node-watch');
const {
  cache,
  isCacheEmpty,
  cacheEmitter,
  getCache,
  setCache,
} = require('../cache');
const { log, error } = require('../logging');
const getExistingCache = require('../cache/getExistingCache');

process.on('exit', (code) => {
  if (code === 0) {
    log(`Gracefully shutting down MockSlate server. code: ${code}`);
  } else {
    error(
      `Server stopped unexpectedly! code: ${code}. Run mockslate --test for more details.`
    );
  }
});

function fetchExpectations(dir) {
  try {
    if (fs.statSync(dir).isDirectory()) {
      fs.readdirSync(dir).forEach((childDir) => {
        fetchExpectations(path.join(dir, childDir));
      });
    } else {
      const fileContent = fs.readFileSync(dir, {
        encoding: 'utf-8',
      });
      if (fileContent.trim()) {
        cache(JSON.parse(fileContent), dir);
      }
    }
  } catch (e) {
    if (args.test) {
      error(e);
    }
    process.exit(1);
  }
}

function refreshExpectations(expectationsDir) {
  if (fs.existsSync(expectationsDir)) {
    fetchExpectations(expectationsDir);
    cacheEmitter.emit('success', getCache());
  } else {
    cacheEmitter.emit('error');
    error('Expecation directory not found!');
  }
}

module.exports = {
  refreshExpectations,
  loadExpectations() {
    const expectationsDir = path.join(process.cwd(), args.dir);
    // If cache exists then use cache instead to save load time
    const existingCache = getExistingCache();
    // If cache exists then cache is prioritized to start the server quickly
    if (!isCacheEmpty(existingCache)) {
      setCache(existingCache);
      cacheEmitter.emit('success', existingCache);
    }
    // expectations are refreshed regardless of cache existence however server is ready sooner
    refreshExpectations(expectationsDir);
    log('Expectations synced...');
    watch(expectationsDir, { recursive: true }, (_, filePath) => {
      filePath = filePath.trim();
      if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isFile()) {
          fetchExpectations(filePath);
        }
      } else {
        // Remove potential expectations from cache that matches the path
        const currentCache = getCache();
        const removeKeys = [];
        Object.keys(currentCache).forEach((key) => {
          if (currentCache[key].includes(filePath)) {
            removeKeys.push(key);
          }
        });
        removeKeys.forEach((key) => {
          log(`Removed expectation: ${key}`);
          // rome-ignore lint/performance/noDelete: Removing the key instead of setting as undefined to save disk space
          delete currentCache[key];
        });
      }
    });
  },
};
