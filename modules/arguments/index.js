module.exports = require('yargs')
  .option('dir', {
    alias: 'd',
    type: 'string',
    default: 'expectations',
    description: "Expectations directory. Default is 'expectations'.",
  })
  .option('test', {
    description: '[Developer only] Run server in test mode',
    type: 'boolean',
    hidden: true,
  })
  .option('cert', {
    alias: 'c',
    type: 'string',
    default: process.cwd(),
    description:
      'Certificate directory to run server using https. Certificate directory must contain "key.pem" (private key) and "cert.pem" (certificate) files.',
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    default: process.env.PORT || 4000,
    description: 'Port number on which this server will run. Default: 4000',
  })
  .option('sslPort', {
    alias: 's',
    type: 'number',
    default: process.env.PORT || 8443,
    description: 'Port number on which this server will run. Default: 8443',
  }).argv;
