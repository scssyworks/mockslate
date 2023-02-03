const args = require('../arguments');
const { error } = require('../logging');
const fs = require('fs');
const { isObject } = require('./objects');

function exists(inputPath) {
  return typeof inputPath === 'string' && fs.existsSync(inputPath);
}

function readJSON(inputPath) {
  try {
    const fileData = fs.readFileSync(inputPath, {
      encoding: 'utf-8',
    });
    const parsedData = JSON.parse(fileData.trim()); // If parse failed, method will return empty object
    return parsedData;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return {};
  }
}

function writeJSON(inputPath, data) {
  if (typeof inputPath === 'string' && isObject(data)) {
    const stringData = JSON.stringify(data);
    fs.writeFileSync(inputPath, stringData);
  }
}

function getStats(inputPath) {
  return fs.statSync(inputPath);
}

function isDir(inputPath) {
  try {
    const isDirectory = getStats(inputPath).isDirectory();
    return isDirectory;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return false;
  }
}

function isFile(inputPath) {
  try {
    const isFile = getStats(inputPath).isFile();
    return isFile;
  } catch (e) {
    if (args.test) {
      error(e);
    }
    return false;
  }
}

function readDir(inputPath) {
  return fs.readdirSync(inputPath);
}

function makeDir(inputPath) {
  fs.mkdirSync(inputPath, {
    recursive: true,
  });
}

function getFileTimestamp(inputPath) {
  return getStats(inputPath).mtime.getTime();
}

function deleteFile(inputPath) {
  fs.unlinkSync(inputPath);
}

module.exports = {
  exists,
  readJSON,
  writeJSON,
  isDir,
  isFile,
  readDir,
  getFileTimestamp,
  deleteFile,
  makeDir,
};
