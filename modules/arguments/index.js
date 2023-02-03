module.exports = require('yargs')
  .option('watch', {
    alias: 'w',
    type: 'string',
    default: 'expectations',
    description: "Expectations directory. Default is 'expectations'.",
  })
  .option('test', {
    description: '[Developer only] Run server in test mode',
    type: 'boolean',
    hidden: true,
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    default: 4000,
    description: 'Port number on which this server will run. Default: 4000',
  })
  .option('sslPort', {
    alias: 's',
    type: 'number',
    default: 8443,
    description: 'Port number on which this server will run. Default: 8443',
  }).argv;
