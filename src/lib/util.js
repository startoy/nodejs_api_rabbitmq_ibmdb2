/**
 * @name util.js
 * @description customize utility for god's sake
 */
import logger from 'util.log';
import * as cnf from './config';
import fs from 'fs';

fs.existsSync('./logs') || fs.mkdirSync('./logs');

// TODO: try to use file stream for rotate file
const log = logger.instance({
  namespace: 'NodeRB',
  nsWidth: 6,
  directory: './logs/messages/',
  toConsole: true,
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

function precise(x, precision) {
  return Number.parseFloat(x).toPrecision(precision);
}

function isString(input) {
  if (typeof input === 'string') return 1;
  return 0;
}

function jForm(msg) {
  return { message: msg.toString() };
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function decode64(base64Data) {
  return Buffer.from(base64Data, 'base64').toString('ascii');
}

function encode64(data) {
  return Buffer.from(data).toString('base64');
}

module.exports = {
  log: log,
  devlog: devlog,
  isString: isString,
  jForm: jForm,
  precise: precise,
  wait: wait,
  decode64: decode64,
  encode64: encode64
};
