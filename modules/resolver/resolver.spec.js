const { codes, errors } = require('../../config/constants');
const { toQS } = require('../utils');
const resolver = require('./resolver');

const mockReadExpectation = jest.fn();
jest.mock('./readExpectation', () => ({
  readExpectation: () => mockReadExpectation(),
}));

describe('resolver()', () => {
  const response = {
    code: 200,
    response: { test: '1234' },
  };
  afterAll(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    mockReadExpectation.mockReturnValue(response);
  });
  afterEach(() => {
    mockReadExpectation.mockReset();
  });
  it('should resolve data for input request with both query and body', () => {
    const request = 'GET /path/to/api c:200';
    const body = { q: 123 };
    const query = { r: 456 };
    const cache = {
      [`${request} qs:${toQS(query)} body:${toQS(body)}`]: '/path/to/file',
    };
    expect(resolver(cache, request, { query, body })).toEqual(response);
  });
  it('should resolve data for input request with partial match for query', () => {
    const request = 'GET /path/to/api c:200';
    const body = { q: 123 };
    const query = { r: 456 };
    const cache = {
      [`${request} qs:${toQS(query)} body:`]: '/path/to/file',
    };
    expect(resolver(cache, request, { query, body })).toEqual(response);
  });
  it('should resolve data for input request with partial match for body', () => {
    const request = 'GET /path/to/api c:200';
    const body = { q: 123 };
    const query = { r: 456 };
    const cache = {
      [`${request} qs: body:${toQS(body)}`]: '/path/to/file',
    };
    expect(resolver(cache, request, { query, body })).toEqual(response);
  });
  it('should resolve data for input request with empty match', () => {
    const request = 'GET /path/to/api c:200';
    const body = { q: 123 };
    const query = { r: 456 };
    const cache = {
      [`${request} qs: body:`]: '/path/to/file',
    };
    expect(resolver(cache, request, { query, body })).toEqual(response);
  });
  it('should resolve to NOT_FOUND if request does not match', () => {
    const request = 'GET /path/to/api c:200';
    const body = { q: 123 };
    const query = { r: 456 };
    const cache = {
      [`${request} qs:${toQS(query)} body:${toQS(body)}`]: '/path/to/file',
    };
    expect(resolver(cache, request, {})).toEqual({
      code: codes.NOT_FOUND,
      response: {
        body: errors.NOT_FOUND_ERR,
        error: codes[codes.NOT_FOUND],
      },
    });
  });
});
