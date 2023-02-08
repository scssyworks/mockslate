const { toQS } = require('../utils');
const { codes } = require('../../config/constants');
const { getEmptyResponse } = require('./getEmptyResponse');
const { readExpectation } = require('./readExpectation');

module.exports = function resolver(cache, requestedPath, req) {
  const completePath = `${requestedPath} qs:${toQS(req.query)} body:${toQS(
    req.body
  )}`.trim();
  if (cache[completePath]) {
    return readExpectation(cache[completePath], completePath);
  }
  const qsPath = `${requestedPath} qs:${toQS(req.query)} body:`;
  if (cache[qsPath]) {
    return readExpectation(cache[qsPath], completePath);
  }
  const bodyPath = `${requestedPath} qs: body:${toQS(req.body)}`.trim();
  if (cache[bodyPath]) {
    return readExpectation(cache[bodyPath], completePath);
  }
  const emptyPath = `${requestedPath} qs: body:`;
  if (cache[emptyPath]) {
    return readExpectation(cache[emptyPath], emptyPath);
  }
  return getEmptyResponse(codes.NOT_FOUND);
};
