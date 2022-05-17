const utils = require('util')
const logger = new console.Console({ stderr: process.stderr, stdout: process.stdout })

logger.info = (msg, ...optionalParams) => {
  process.stdout.write(`${new Date().toISOString()} [INFO]: ${utils.format(msg, ...optionalParams)}\n`)
}
logger.log = (msg, ...optionalParams) => {
  process.stdout.write(`${new Date().toISOString()} [LOG]: ${utils.format(msg, ...optionalParams)}\n`)
}
logger.error = (msg, ...optionalParams) => {
  process.stderr.write(`${new Date().toISOString()} [ERROR]\n${utils.format(msg, ...optionalParams)}\n`)
}

/**
 * @type {Console}
 */
module.exports = logger
