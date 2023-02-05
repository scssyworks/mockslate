const { isObject } = require('./objects');

describe('object', () => {
  describe('isObject', () => {
    it('should return true if input type is an object', () => {
      expect(isObject({ test: 'hello' })).toBeTruthy();
    });
    it('should return false if input type is NULL or UNDEFINED', () => {
      expect(isObject(null)).toBeFalsy();
      expect(isObject()).toBeFalsy();
    });
    it('should return false if input type is not an object', () => {
      expect(isObject(1)).toBeFalsy();
      expect(isObject(true)).toBeFalsy();
      expect(isObject('true')).toBeFalsy();
    });
  });
});
