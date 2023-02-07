const enableHttps = require('./enableHttps');

const mockExists = jest.fn();
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  exists: () => mockExists(),
}));
jest.mock('../logging');

describe('enableHttps()', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    mockExists.mockReset();
  });
  it('should throw error if file does not exist and an error is thrown', () => {
    mockExists.mockImplementation(() => {
      throw new Error();
    });
    expect(enableHttps()).toBeFalsy();
  });
  it('should return true if key.pem and cert.pem files exist', () => {
    mockExists.mockReturnValue(true);
    expect(enableHttps()).toBeTruthy();
  });
  it('should return value from cache', () => {
    expect(enableHttps()).toBeTruthy();
  });
});
