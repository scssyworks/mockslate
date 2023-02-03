const server = require('./config/server');
const resolver = require('./modules/resolver');

server(({ cache, key, query, body }) => {
  return resolver(cache, key, { query, body });
});
