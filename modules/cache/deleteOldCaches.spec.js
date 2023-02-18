const { deleteOldCaches } = require('./deleteOldCaches');

const mockDeleteFile = jest.fn();
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  deleteFile: () => mockDeleteFile(),
}));

jest.mock('./getCacheLocation', () => ({
  ...jest.requireActual('./getCacheLocation'),
  getCacheLocation: () => '',
}));

describe('deleteOldCaches', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    mockDeleteFile.mockReset();
  });
  it('should delete old caches if they exists', () => {
    deleteOldCaches(['1.json', '2.json']);
    expect(mockDeleteFile).toHaveBeenCalledTimes(2);
  });
  it('should do nothing if there are no old caches', () => {
    deleteOldCaches([]);
    expect(mockDeleteFile).not.toHaveBeenCalled();
  });
});
