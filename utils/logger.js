const chalk = require('chalk');

function logInfo(msg) {
  console.log(chalk.cyan(msg));
}

function logError(msg) {
  console.error(chalk.red(msg));
}

module.exports = { logInfo, logError };