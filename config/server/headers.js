const enableHttps = require('../../modules/enableHttps');

const enableSSL = enableHttps();

module.exports = function getRequestedCode(req, res) {
  if (enableSSL) {
    res.setHeader(
      'Strict-Transport-Policy',
      'max-age=9999999, includeSubDomains'
    );
  }

  const xRequestedCode = +req.headers['x-requested-code'];
  if (!Number.isNaN(xRequestedCode)) {
    return xRequestedCode;
  }
  return 200;
};
