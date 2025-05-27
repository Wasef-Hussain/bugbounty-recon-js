const chalk = require('chalk');

function logInfo(msg) {
  console.log(chalk.blue(`[*] ${msg}`));
}

function logSuccess(msg) {
  console.log(chalk.green(`[+] ${msg}`));
}

function logError(msg) {
  console.error(chalk.red(`[!] ${msg}`));
}

module.exports = {
  logInfo,
  logSuccess,
  logError,
};
