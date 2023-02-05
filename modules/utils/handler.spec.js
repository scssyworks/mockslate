const { handler } = require('./handler');
const mockError = jest.fn();
jest.mock('../arguments', () => {
  return {
    test: true,
  };
});
jest.mock('../logging', () => ({
  ...jest.requireActual('../logging'),
  error: () => mockError(),
}));

describe('Handler', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  it('should handles the callback correctly', () => {
    expect(
      handler(() => {
        return true;
      }, false)
    ).toBeTruthy();
    expect(
      handler(() => {
        throw new Error('Some error');
      }, false)
    ).toBeFalsy();
  });
  it('should log error if test mode is enabled', () => {
    handler(() => {
      throw new Error('Some error');
    }, false);
    expect(mockError).toHaveBeenCalled();
  });
});
