const fs = require('fs');
const { isObject } = require('./objects');
const { handler } = require('./handler');
const { errors } = require('../../config/constants');

/**
 * Checks if file exists
 * @param {string} inputPath File or folder path
 * @returns {boolean}
 */
function exists(inputPath) {
  return typeof inputPath === 'string' && fs.existsSync(inputPath);
}

/**
 * Reads JSON text from file and returns a parsed object
 * @param {string} inputPath File path
 * @returns {boolean}
 */
function readJSON(inputPath) {
  return handler(() => {
    const fileData = fs.readFileSync(inputPath, {
      encoding: 'utf-8',
    });
    const parsedData = JSON.parse(fileData.trim()); // If parse failed, method will return empty object
    if (!parsedData) {
      throw new Error(errors.INVALID_DATA_ERR);
    }
    return parsedData;
  }, {});
}

/**
 * Writes object data as JSON
 * @param {string} inputPath File path
 * @param {{[key: string]: any}} data Data object
 */
function writeJSON(inputPath, data) {
  if (typeof inputPath === 'string' && isObject(data)) {
    const stringData = JSON.stringify(data);
    fs.writeFileSync(inputPath, stringData);
  }
}

/**
 * Gets stats for file or folder
 * @param {string} inputPath File or folder path
 * @returns {fs.Stats}
 */
function getStats(inputPath) {
  return fs.statSync(inputPath);
}

/**
 * Checks if input path is a folder
 * @param {string} inputPath File or folder path
 * @returns {boolean}
 */
function isDir(inputPath) {
  return handler(() => {
    const isDirectory = getStats(inputPath).isDirectory();
    return isDirectory;
  }, false);
}

/**
 * Checks if input path is a file
 * @param {string} inputPath File or folder path
 * @returns {boolean}
 */
function isFile(inputPath) {
  return handler(() => {
    const isFile = getStats(inputPath).isFile();
    return isFile;
  }, false);
}

/**
 * Returns list of files and folders within a directory
 * @param {string} inputPath Folder path
 * @returns {string[]}
 */
function readDir(inputPath) {
  return handler(() => {
    if (typeof inputPath === 'string' && inputPath.trim()) {
      const files = fs.readdirSync(inputPath);
      return files;
    }
    return [];
  }, []);
}

/**
 * Creates a directory
 * @param {string} inputPath Folder path
 */
function makeDir(inputPath) {
  if (typeof inputPath === 'string' && inputPath.trim()) {
    fs.mkdirSync(inputPath, {
      recursive: true,
    });
  }
}

/**
 * Gets modified time of a file
 * @param {string} inputPath File or folder path
 * @returns {number}
 */
function getFileTimestamp(inputPath) {
  return getStats(inputPath).mtime.getTime();
}

/**
 * Deletes a file or folder
 * @param {string} inputPath File or folder path
 */
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
