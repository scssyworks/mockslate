const fs = require('fs');
const { isEmptyObject } = require('../utils');
const qs = require('qs');
const { removeFromCache } = require('../cache');
const { log } = require('../logging');

function getEmptyResponse(code = 500) {
  let error = '';
  let body = '';
  switch (code) {
    case 404:
      error = 'NOT_FOUND';
      body = 'Expectation not found! Please try again after some time.';
      break;
    case 500:
      error = 'INTERNAL_SERVER_ERROR';
      body =
        'Error while loading expectation. Please check if expectation format is correct!';
      break;
  }
  return { code, response: { error, body } };
}

function readExpectation(path, cacheEntry) {
  let returnResponse = {
    code: 200,
    response: {},
  };
  if (fs.existsSync(path)) {
    const { httpResponse } = JSON.parse(
      fs.readFileSync(path, {
        encoding: 'utf-8',
      })
    );
    if (isEmptyObject(httpResponse)) {
      returnResponse = {
        ...returnResponse,
        ...getEmptyResponse(500),
      };
    } else {
      const {
        status = 200,
        statusCode = 200,
        response: mockResponse = {},
      } = httpResponse;
      returnResponse = {
        ...returnResponse,
        code: status || statusCode,
        response: mockResponse,
      };
    }
  } else {
    removeFromCache(cacheEntry);
  }
  return returnResponse;
}

module.exports = function resolver(cache, requestedPath, req) {
  // Check for complete match
  const completePath = `${requestedPath} qs:${qs.stringify(
    req.query
  )} body:${qs.stringify(req.body)}`.trim();
  if (cache[completePath]) {
    // A complete match was found
    return readExpectation(cache[completePath], completePath);
  }
  log('Attempting response with partial match...');
  // Check for partial matches
  // Check if query string matched
  const qsPath = `${requestedPath} qs:${qs.stringify(req.query)} body:`;
  if (cache[qsPath]) {
    // A query string match was found
    return readExpectation(cache[qsPath], completePath);
  }
  // Check if body match was found
  const bodyPath = `${requestedPath} qs: body:${qs.stringify(req.body)}`.trim();
  if (cache[bodyPath]) {
    // A query string match was found
    return readExpectation(cache[bodyPath], completePath);
  }
  // Check a match with no query string and no body
  const emptyPath = `${requestedPath} qs: body:`;
  if (cache[emptyPath]) {
    return readExpectation(cache[emptyPath]);
  }
  return getEmptyResponse(404);
};
