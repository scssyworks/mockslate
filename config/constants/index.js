const codes = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  200: 'SUCCESS',
  404: 'NOT_FOUND',
  500: 'INTERNAL_SERVER_ERROR',
};

const errors = {
  NOT_FOUND_ERR: 'Expectation not found! Please try again after some time.',
  EXPECTATION_ERR:
    'Error while loading expectation. Please check if expectation format is correct!',
  FILE_NOT_FOUND_ERR: 'File not available on disk!',
  DIR_NOT_FOUND_ERR: 'Expectations directory not found!',
};

const events = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const messages = {
  EXIT_0: 'Gracefully shutting down mock server!',
  EXIT_N:
    'Process exited with code {0}. Run "mockslate --test" for more details.',
  SYNC: 'Expectations synced...',
  EXP_REMOVED: 'Removed expectation: {0}',
  EXP_ADDED: 'Added expectation: {0}',
  PORT: 'Server is listening on {0}',
  CACHE: 'Warming up cache...',
  CACHE_READY: 'Expectations are ready!',
};

module.exports = {
  codes,
  errors,
  events,
  messages,
};
