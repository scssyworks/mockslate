const { codes, errors } = require('../../config/constants');

module.exports = {
  getEmptyResponse(code = codes.INTERNAL_SERVER_ERROR) {
    let error = '';
    let body = '';
    switch (code) {
      case codes.NOT_FOUND:
        error = codes[codes.NOT_FOUND];
        body = errors.NOT_FOUND_ERR;
        break;
      case codes.INTERNAL_SERVER_ERROR:
        error = codes[codes.INTERNAL_SERVER_ERROR];
        body = errors.EXPECTATION_ERR;
        break;
    }
    return { code, response: { error, body } };
  },
};
