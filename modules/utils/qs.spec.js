const { toQS } = require('./qs');

describe('toQS()', () => {
  it('should convert object to valid query string', () => {
    expect(toQS({ q: 123, r: 'hello' })).toBe('q=123&r=hello');
  });
  it('should return empty string if input is not a valid object', () => {
    expect(toQS(null)).toBe('');
  });
});
