const https = require('https');
const express = require('express');
const enableHttps = require('../../modules/enableHttps');
const fs = require('fs');
const args = require('../../modules/arguments');
const path = require('path');
const { log, info, error } = require('../../modules/logging');
const { waitForCache } = require('../../modules/cache');
const listener = require('./listener');
const getRequestedCode = require('./headers');

const enableSSL = enableHttps();

const app = express();

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

module.exports = function server(handler) {
  app.use('*', async (req, res) => {
    const { query, body } = req;
    try {
      const cache = await waitForCache();
      let requestedKey = `${req.method} ${req.baseUrl}`;
      info(requestedKey);
      let result = null;
      if (typeof handler === 'function') {
        result = handler({
          cache,
          key: `${requestedKey} c:${getRequestedCode(req, res)}`,
          query,
          body,
        });
      }
      if (result) {
        const { code, response } = result;
        info('Response:');
        log({ code, response });
        res.status(code).json(response);
      } else {
        throw new Error('Invalid response');
      }
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

  if (enableSSL) {
    const options = {
      key: fs.readFileSync(path.join(args.cert, 'key.pem')),
      cert: fs.readFileSync(path.join(args.cert, 'cert.pem')),
    };
    https
      .createServer(options, app)
      .listen(args.sslPort, listener(args.sslPort));
  } else {
    app.listen(args.port, listener(args.port));
  }
};
