const { formatCacheKey, formatRequestBody } = require('./formatCacheKey');

describe('formatCacheKey', () => {
  describe('formatCacheKey()', () => {
    it('should format cache key correctly', () => {
      expect(formatCacheKey('GET', '/path/to/api', 200)).toBe(
        'GET /path/to/api c:200 qs: body:'
      );
    });
    it('should format cache key correctly if query string is passed', () => {
      expect(formatCacheKey('GET', '/path/to/api', 200, { q: 123 })).toBe(
        'GET /path/to/api c:200 qs:q=123 body:'
      );
    });
    it('should format cache key correctly if body is passed', () => {
      expect(formatCacheKey('GET', '/path/to/api', 200, {}, { r: 456 })).toBe(
        'GET /path/to/api c:200 qs: body:r=456'
      );
    });
    it('should format cache key correctly if both query string and body is passed', () => {
      expect(
        formatCacheKey('GET', '/path/to/api', 200, { q: 123 }, { r: 456 })
      ).toBe('GET /path/to/api c:200 qs:q=123 body:r=456');
    });
  });
  describe('formatRequestBody()', () => {
    it('should format request body correctly', () => {
      expect(formatRequestBody('GET /path/to/api c:200')).toBe(
        'GET /path/to/api c:200 qs: body:'
      );
    });
    it('should format request body correctly if query string is passed', () => {
      expect(formatRequestBody('GET /path/to/api c:200', { q: 123 })).toBe(
        'GET /path/to/api c:200 qs:q=123 body:'
      );
    });
    it('should format request body correctly if body is passed', () => {
      expect(formatRequestBody('GET /path/to/api c:200', {}, { r: 456 })).toBe(
        'GET /path/to/api c:200 qs: body:r=456'
      );
    });
    it('should format request body correctly if both query string and body is passed', () => {
      expect(
        formatRequestBody('GET /path/to/api c:200', { q: 123 }, { r: 456 })
      ).toBe('GET /path/to/api c:200 qs:q=123 body:r=456');
    });
  });
});
