const { codes, errors } = require('../../config/constants');
const { getEmptyResponse } = require('./getEmptyResponse');

describe('getEmptyResponse()', () => {
  it('should return correct response for error code 404', () => {
    expect(getEmptyResponse(codes.NOT_FOUND)).toEqual({
      code: codes.NOT_FOUND,
      response: {
        body: errors.NOT_FOUND_ERR,
        error: codes[codes.NOT_FOUND],
      },
    });
  });
  it('should return correct response for error code 500', () => {
    expect(getEmptyResponse(codes.INTERNAL_SERVER_ERROR)).toEqual({
      code: codes.INTERNAL_SERVER_ERROR,
      response: {
        body: errors.EXPECTATION_ERR,
        error: codes[codes.INTERNAL_SERVER_ERROR],
      },
    });
  });
  it('should return correct response if no code is provided', () => {
    expect(getEmptyResponse()).toEqual({
      code: codes.INTERNAL_SERVER_ERROR,
      response: {
        body: errors.EXPECTATION_ERR,
        error: codes[codes.INTERNAL_SERVER_ERROR],
      },
    });
  });
});
