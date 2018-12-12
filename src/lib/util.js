/**
 * @name util.js
 * @description customize utility for god's sake
 */
import logger from 'util.log';
import * as cnf from './config';

function isNumber(input) {
  // is type number( ex. "123" , 123) AND not null with "" (which is string null)
  if (
    typeof Number(input) === 'number' &&
    Math.floor(Number(input)) === Number(input) &&
    input !== ''
  )
    return 1;
  return 0;
}

// TODO: try to use file stream for rotate file
const log = logger.instance({
  namespace: 'NodeRB',
  nsWidth: 6,
  directory: './logs/messages/',
  toConsole: cnf.isDev,
  enabled: true
});

// enabled: true when in Dev which mean [toConsole, WriteFile]
// if: false nothing will come out
const devlog = logger.instance({
  namespace: 'DevLog',
  nsWidth: 6,
  directory: './logs/messages_dev/',
  toConsole: cnf.isDev,
  enabled: cnf.isDev
});

module.exports = {
  log: log,
  devlog: devlog,
  isNumber: isNumber
};
