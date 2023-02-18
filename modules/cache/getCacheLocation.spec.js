const { getCacheLocation } = require('./getCacheLocation');
const path = require('path');
const { NM, CACHE_DIR, LIB } = require('../../config/constants');

const mockExists = jest.fn();
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  exists: () => mockExists(),
  makeDir: jest.fn(),
}));

describe('getCacheLocation', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    mockExists.mockReset();
  });
  it('should resolve and return correct cache location', () => {
    mockExists.mockReturnValue(false);
    expect(getCacheLocation()).toBe(
      path.join(process.cwd(), NM, CACHE_DIR, LIB)
    );
  });
  it('should return correct cache location if it already exists', () => {
    mockExists.mockReturnValue(true);
    expect(getCacheLocation()).toBe(
      path.join(process.cwd(), NM, CACHE_DIR, LIB)
    );
  });
  it('should return NULL if some error is thrown', () => {
    mockExists.mockImplementation(() => {
      throw new Error();
    });
    expect(getCacheLocation()).toBeNull();
  });
});
