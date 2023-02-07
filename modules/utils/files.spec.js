const {
  exists,
  readJSON,
  writeJSON,
  isDir,
  isFile,
  getFileTimestamp,
  readDir,
  makeDir,
  deleteFile,
} = require('./files');

const mockStatsImplementation = () => ({
  isDirectory: () => mockIsDirectory(),
  isFile: () => mockIsFile(),
  mtime: {
    getTime: () => mockTimeStamp,
  },
});
const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockStatSync = jest.fn(mockStatsImplementation);
const mockIsDirectory = jest.fn();
const mockIsFile = jest.fn();
const mockReadDirSync = jest.fn();
const mockMkdirSync = jest.fn();
const mockUnlinkSync = jest.fn();

const mockTimeStamp = Date.now();
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: () => mockExistsSync(),
  readFileSync: () => mockReadFileSync(),
  writeFileSync: (...args) => mockWriteFileSync(...args),
  statSync: () => mockStatSync(),
  readdirSync: () => mockReadDirSync(),
  mkdirSync: (...args) => mockMkdirSync(...args),
  unlinkSync: (...args) => mockUnlinkSync(...args),
}));

describe('File handling', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  describe('exists()', () => {
    it('should return true if file exists', () => {
      mockExistsSync.mockReturnValue(true);
      expect(exists('/path/to/file')).toBeTruthy();
    });
    it('should return false if file does not exists', () => {
      mockExistsSync.mockReturnValue(false);
      expect(exists('/path/to/file')).toBeFalsy();
    });
    it('should return false if file path is invalid', () => {
      mockExistsSync.mockReturnValue(false);
      expect(exists(null)).toBeFalsy();
    });
  });
  describe('readJSON()', () => {
    it('should read and parse JSON correctly from input file', () => {
      mockReadFileSync.mockReturnValue('{"test": "hello"}');
      expect(readJSON('/path/to/file')).toEqual({ test: 'hello' });
    });
    it('should return empty object if input file does not have a valid JSON', () => {
      mockReadFileSync.mockReturnValue('null');
      expect(readJSON('/path/to/file')).toEqual({});
    });
  });
  describe('writeJSON()', () => {
    afterEach(() => {
      mockWriteFileSync.mockReset();
    });
    it('should write JSON file if input is a valid object', () => {
      writeJSON('/path/to/file', { q: 123 });
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/path/to/file',
        JSON.stringify({ q: 123 })
      );
    });
    it('should NOT write JSON file if input is NOT a valid object', () => {
      writeJSON('/path/to/file', null);
      expect(mockWriteFileSync).not.toHaveBeenCalled();
    });
    it('should NOT write JSON file if input path is NOT valid', () => {
      writeJSON();
      expect(mockWriteFileSync).not.toHaveBeenCalled();
    });
  });
  describe('isDir()', () => {
    afterEach(() => {
      mockStatSync.mockImplementation(mockStatsImplementation);
    });
    it('should return true if input path is a directory', () => {
      mockIsDirectory.mockReturnValue(true);
      mockIsFile.mockReturnValue(false);
      expect(isDir('/path/to/dir')).toBeTruthy();
    });
    it('should return false if input path is a file', () => {
      mockIsDirectory.mockReturnValue(false);
      mockIsFile.mockReturnValue(true);
      expect(isDir('/path/to/dir')).toBeFalsy();
    });
    it('should return false if input path is neither a directory nor a file', () => {
      mockIsDirectory.mockReturnValue(false);
      mockIsFile.mockReturnValue(false);
      expect(isDir('/path/to/dir')).toBeFalsy();
    });
    it('should return false if input path does not exists', () => {
      mockStatSync.mockImplementation(() => {
        throw new Error();
      });
      expect(isDir('/path/to/dir')).toBeFalsy();
    });
  });
  describe('isFile()', () => {
    afterEach(() => {
      mockStatSync.mockImplementation(mockStatsImplementation);
    });
    it('should return true if input path is a file', () => {
      mockIsDirectory.mockReturnValue(false);
      mockIsFile.mockReturnValue(true);
      expect(isFile('/path/to/file')).toBeTruthy();
    });
    it('should return false if input path is a directory', () => {
      mockIsDirectory.mockReturnValue(true);
      mockIsFile.mockReturnValue(false);
      expect(isFile('/path/to/file')).toBeFalsy();
    });
    it('should return false if input path is neither a directory nor a file', () => {
      mockIsDirectory.mockReturnValue(false);
      mockIsFile.mockReturnValue(false);
      expect(isFile('/path/to/file')).toBeFalsy();
    });
    it('should return false if input path does not exists', () => {
      mockStatSync.mockImplementation(() => {
        throw new Error();
      });
      expect(isFile('/path/to/file')).toBeFalsy();
    });
  });
  describe('getFileTimestamp()', () => {
    it('should return timestamp of input file', () => {
      expect(getFileTimestamp('/path/to/file')).toBe(mockTimeStamp);
    });
  });
  describe('readDir()', () => {
    it('should read directory correctly if input path is valid', () => {
      mockReadDirSync.mockReturnValue(['file1', 'file2']);
      expect(readDir('/path/to/file')).toEqual(['file1', 'file2']);
    });
    it('should return empty array if input path is not valid', () => {
      expect(readDir()).toEqual([]);
    });
    it('should return empty array if input path does not exists', () => {
      mockReadDirSync.mockImplementation(() => {
        throw new Error();
      });
      expect(readDir()).toEqual([]);
    });
  });
  describe('makeDir()', () => {
    afterEach(() => {
      mockMkdirSync.mockReset();
    });
    it('should create directory recursively', () => {
      makeDir('/path/to/dir');
      expect(mockMkdirSync).toHaveBeenCalledWith('/path/to/dir', {
        recursive: true,
      });
    });
    it('should NOT create directory if input path is invalid', () => {
      makeDir(null);
      expect(mockMkdirSync).not.toHaveBeenCalled();
    });
  });
  describe('deleteFile', () => {
    it('should delete file for given input path', () => {
      deleteFile('/path/to/file');
      expect(mockUnlinkSync).toHaveBeenCalledWith('/path/to/file');
    });
  });
});
