const { isEmptyObject, toQS, exists, readJSON } = require('../utils');
const { removeFromCache } = require('../cache');
const { codes, errors } = require('../../config/constants');

function getEmptyResponse(code = codes.INTERNAL_SERVER_ERROR) {
  let error = '';
  let body = '';
  switch (code) {
    case codes.NOT_FOUND:
      error = codes[codes.NOT_FOUND];
      body = errors.NOT_FOUND_ERR;
      break;
    case codes.INTERNAL_SERVER_ERROR:
      error = codes[codes.INTERNAL_SERVER_ERROR];
      body = errors.EXPECTATION_ERR;
      break;
  }
  return { code, response: { error, body } };
}

function readExpectation(path, cacheEntry) {
  let returnResponse = {
    code: codes.SUCCESS,
    response: {},
  };
  if (exists(path)) {
    const { httpResponse } = readJSON(path);
    if (isEmptyObject(httpResponse)) {
      returnResponse = {
        ...returnResponse,
        ...getEmptyResponse(codes.INTERNAL_SERVER_ERROR),
      };
    } else {
      const { status, statusCode, response: mockResponse = {} } = httpResponse;
      returnResponse = {
        ...returnResponse,
        code: status || statusCode || codes.SUCCESS,
        response: mockResponse,
      };
    }
  } else {
    removeFromCache(cacheEntry);
  }
  return returnResponse;
}

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
    return readExpectation(cache[emptyPath]);
  }
  return getEmptyResponse(codes.NOT_FOUND);
};
