const { codes } = require('../../config/constants');
const { request, removeFromCache } = require('../cache');
const { exists, readJSON, isEmptyObject } = require('../utils');
const { getEmptyResponse } = require('./getEmptyResponse');

module.exports = {
  readExpectation(path, cacheEntry) {
    return request(path, () => {
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
          const {
            status,
            statusCode,
            response: mockResponse = {},
          } = httpResponse;
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
    });
  },
};
