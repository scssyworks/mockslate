const { toQS } = require('../utils');

/**
 * Formats cache key in desired format
 * @param {string} method Request method
 * @param {string} pathString Request path
 * @param {string | number} code Status code
 * @param {{[key:string]:any}} qs Query string parameters
 * @param {{[key:string]:any}} body Body parameters
 * @returns {string}
 */
function formatCacheKey(method, pathString, code, qs = {}, body = {}) {
  const [path] = pathString.split('?');
  return formatRequestBody(
    `${method.trim()} ${path.trim()} c:${`${code}`.trim()}`,
    qs,
    body
  );
}

/**
 * Adds query string and body to formatted path string
 * @param {string} pathString Mockslate formatted path string
 * @param {{[key:string]:any}} qs Query string parameters
 * @param {{[key:string]:any}} body Body parameters
 * @returns {string}
 */
function formatRequestBody(pathString, qs = {}, body = {}) {
  return `${pathString.trim()} qs:${toQS(qs).trim()} body:${toQS(body).trim()}`;
}

module.exports = {
  formatCacheKey,
  formatRequestBody,
};
