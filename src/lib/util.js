/**
 * @name util.js
 * @description customize utility for using in app
 */
import logger from 'util.log';
import * as conf from './config';
import fs from 'fs';

fs.existsSync('./logs') || fs.mkdirSync('./logs');

// FIXME: rotate file

const log = logger.instance({
  namespace: 'NodeRB',
  nsWidth: 6,
  directory: './logs/messages/',
  toConsole: true,
  enabled: true
});

const devlog = logger.instance({
  namespace: 'DevLog',
  nsWidth: 6,
  directory: './logs/messages_dev/',
  toConsole: conf.isDev,
  enabled: conf.isDev
});

const datalog = logger.instance({
  namespace: 'DataLog',
  nsWidth: 7,
  directory: './logs/messages_data/',
  toConsole: conf.logConsole,
  enabled: true
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

function printf(format) {
  // (...a) => {return a.reduce((p: string, c: any) => p.replace(/%s/, c));
  var values = Array.prototype.slice.call(arguments, 1);
  function insert(str, val) {
    return str.replace(/%s/, val);
  }
  return values.reduce(insert, format);
}

module.exports = {
  log: log,
  devlog: devlog,
  datalog: datalog,
  isString: isString,
  jForm: jForm,
  precise: precise,
  wait: wait,
  decode64: decode64,
  encode64: encode64,
  printf: printf
};
