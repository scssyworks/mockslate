const server = require('./config/server');
const resolver = require('./modules/resolver');

server(({ cache, key, query, body }) => {
  const { code, response } = resolver(cache, key, { query, body });
  return { code, response };
});
