const chalk = require('chalk');

function getValidArgs(args) {
  const restArgs = [];
  const strArgs = [];
  args.forEach((arg) => {
    if (arg === null || typeof arg !== 'object') {
      strArgs.push(arg);
    } else {
      restArgs.push(arg);
    }
  });
  return { strArgs, restArgs };
}

function logger(color, args) {
  const { strArgs, restArgs } = getValidArgs(args);
  if (strArgs.length) {
    console.log(chalk[color](chalk.bold(...args)));
  }
  if (restArgs.length) {
    console.log(...restArgs);
  }
}

module.exports = {
  log(...args) {
    logger('green', args);
  },
  warn(...args) {
    logger('yellow', args);
  },
  error(...args) {
    logger('red', args);
  },
  info(...args) {
    logger('blue', args);
  },
};
