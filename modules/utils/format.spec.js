const { formatMessage } = require('./format');

describe('format', () => {
  describe('formatMessage()', () => {
    it('should return formatted text for provided arguments', () => {
      expect(formatMessage('Test {0}, {0} and {1}', ['ZERO', 'ONE'])).toBe(
        'Test ZERO, ZERO and ONE'
      );
    });
    it('should return unformatted text if arguments array is not passed', () => {
      expect(formatMessage('Test {0}, {0} and {1}')).toBe(
        'Test {0}, {0} and {1}'
      );
    });
    it('should return input without modification if input is NOT of type string', () => {
      expect(formatMessage({})).toEqual({});
    });
  });
});
