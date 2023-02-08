const { codes, errors } = require('../../config/constants');
const { readExpectation } = require('./readExpectation');

const mockRemoveFromCache = jest.fn();
jest.mock('../cache', () => ({
  ...jest.requireActual('../cache'),
  request: (_, callback) => callback(),
  removeFromCache: () => mockRemoveFromCache(),
}));

const mockExists = jest.fn();
const mockReadJSON = jest.fn();
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  exists: () => mockExists(),
  readJSON: () => mockReadJSON(),
}));

const successResponse = {
  code: codes.SUCCESS,
  response: {
    success: true,
  },
};
const emptyErrorResponse = {
  code: codes.INTERNAL_SERVER_ERROR,
  response: {
    body: errors.EXPECTATION_ERR,
    error: codes[codes.INTERNAL_SERVER_ERROR],
  },
};
const mockGetEmptyResponse = jest.fn(() => emptyErrorResponse);
jest.mock('./getEmptyResponse', () => ({
  getEmptyResponse: () => mockGetEmptyResponse(),
}));

describe('readExpectation()', () => {
  afterEach(() => {
    mockExists.mockReset();
    mockReadJSON.mockReset();
    mockRemoveFromCache.mockReset();
  });
  it('should return an empty success response if input file does not exists', () => {
    mockExists.mockReturnValue(false);
    expect(readExpectation('/path/to/file', 'GET /request/path c:200')).toEqual(
      { code: codes.SUCCESS, response: {} }
    );
    expect(mockRemoveFromCache).toHaveBeenCalled();
  });
  it('should return an empty success response if input file exists and contains a valid response without response body', () => {
    mockExists.mockReturnValue(true);
    mockReadJSON.mockReturnValue({
      httpResponse: {
        statusCode: codes.SUCCESS,
      },
    });
    expect(readExpectation('/path/to/file', 'GET /request/path c:200')).toEqual(
      { code: codes.SUCCESS, response: {} }
    );
    expect(mockRemoveFromCache).not.toHaveBeenCalled();
  });
  it('should return success response if input file exists and contains a valid response', () => {
    mockExists.mockReturnValue(true);
    mockReadJSON.mockReturnValue({
      httpResponse: {
        status: codes.SUCCESS,
        response: successResponse.response,
      },
    });
    expect(readExpectation('/path/to/file', 'GET /request/path c:200')).toEqual(
      successResponse
    );
    expect(mockRemoveFromCache).not.toHaveBeenCalled();
  });
  it('should return status code as 200 if input file has valid response without status code', () => {
    mockExists.mockReturnValue(true);
    mockReadJSON.mockReturnValue({
      httpResponse: {
        response: successResponse.response,
      },
    });
    expect(readExpectation('/path/to/file', 'GET /request/path c:200')).toEqual(
      successResponse
    );
    expect(mockRemoveFromCache).not.toHaveBeenCalled();
  });
  it('should return error response if input file exists but contain an invalid response', () => {
    mockExists.mockReturnValue(true);
    mockReadJSON.mockReturnValue({});
    expect(readExpectation('/path/to/file', 'GET /request/path c:200')).toEqual(
      emptyErrorResponse
    );
    expect(mockRemoveFromCache).not.toHaveBeenCalled();
  });
});
