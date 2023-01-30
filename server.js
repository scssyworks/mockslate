const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { loadExpectations } = require('./modules/load-expectations');
const enableHttps = require('./modules/enableHttps');
const args = require('./modules/arguments');
const { log, error, info } = require('./modules/logging');
const { waitForCache } = require('./modules/cache');
const resolver = require('./modules/resolver');

const enableSSL = enableHttps();
const app = express();

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('*', async (req, res) => {
  let requestedCode = 200;
  if (enableSSL) {
    res.setHeader(
      'Strict-Transport-Policy',
      'max-age=9999999, includeSubDomains'
    );
    const xRequestedCode = +res.getHeader('x-requested-code');
    if (!Number.isNaN(xRequestedCode)) {
      requestedCode = xRequestedCode;
    }
  }
  try {
    const cache = await waitForCache();
    let requestedKey = `${req.method} ${req.baseUrl}`;
    info(requestedKey);
    requestedKey = `${requestedKey} c:${requestedCode}`;
    const { code, response } = resolver(cache, requestedKey, req);
    info('Response:');
    log({ code, response });
    res.status(code).json(response);
  } catch (e) {
    if (args.test) {
      error(e);
    }
    res
      .status(500)
      .send(
        'Server started with errors! Please run mockslate --test for more details.'
      );
  }
});

function listener(port) {
  return () => {
    log(`Server is listening on ${port}`);
    log('Warming up cache...');
    loadExpectations();
    log('Expectations are ready!');
  };
}

if (enableSSL) {
  const options = {
    key: fs.readFileSync(path.join(args.cert, 'key.pem')),
    cert: fs.readFileSync(path.join(args.cert, 'cert.pem')),
  };
  https.createServer(options, app).listen(args.sslPort, listener(args.sslPort));
} else {
  app.listen(args.port, listener(args.port));
}
