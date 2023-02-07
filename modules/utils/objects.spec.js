const { isObject, isEmptyObject, deleteKey } = require('./objects');

describe('object', () => {
  describe('isObject()', () => {
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
  describe('isEmptyObject()', () => {
    it('should return true if input is an empty object', () => {
      expect(isEmptyObject({})).toBeTruthy();
    });
    it('should return true if input is a falsy or invalid value', () => {
      expect(isEmptyObject(null)).toBeTruthy();
      expect(isEmptyObject()).toBeTruthy();
      expect(isEmptyObject('')).toBeTruthy();
      expect(isEmptyObject('test')).toBeTruthy();
    });
    it('should return false if object is not empty', () => {
      expect(isEmptyObject({ q: 123 })).toBeFalsy();
    });
  });
  describe('deleteKey()', () => {
    it('should delete key from object', () => {
      const obj = { q: 123 };
      deleteKey(obj, 'q');
      expect(obj).toEqual({});
    });
    it('should NOT delete key if key does not exists in an object', () => {
      const obj = { q: 123 };
      deleteKey(obj, 'r');
      expect(obj).toEqual({ q: 123 });
    });
    it('should NOT delete key if input object is invalid', () => {
      const obj = 'test';
      deleteKey(obj, 'q');
      expect(obj).toBe('test');
    });
  });
});
