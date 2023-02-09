const chalk = require('chalk');
const { isObject } = require('../utils/objects');

function logger(color, args) {
  const formattedArgs = [];
  args.forEach((arg) => {
    if (isObject(arg)) {
      formattedArgs.push(`\n${JSON.stringify(arg, null, 2)}\n`);
    } else {
      formattedArgs.push(chalk.bold(arg));
    }
  });
  console.log(chalk[color](formattedArgs.join(' ')));
}

module.exports = {
  log(...args) {
    logger('green', args);
  },
  warn(...args) {
    logger('yellow', args);
  },
  error(...args) {
    console.error(...args);
  },
  info(...args) {
    logger('blue', args);
  },
};
