/**
 * @name util.js
 * @description customize utility for using in app
 */
import logger from 'util.log';
import * as conf from './config';
import fs from 'fs';

fs.existsSync('./logs') || fs.mkdirSync('./logs');

// FIXME: rotate file
let maxWidth = 4;
const log = logger.instance({
  namespace: 'Node',
  nsWidth: maxWidth,
  directory: './logs/messages_node/',
  toConsole: conf.log.node,
  enabled: true
});

const dblog = logger.instance({
  namespace: 'DB2',
  nsWidth: maxWidth,
  directory: './logs/messages_db/',
  toConsole: conf.log.db,
  enabled: true
});

const devlog = logger.instance({
  namespace: 'DevE',
  nsWidth: maxWidth,
  directory: './logs/messages_dev/',
  toConsole: conf.log.dev,
  enabled: conf.log.dev
});

const datalog = logger.instance({
  namespace: 'Data',
  nsWidth: maxWidth,
  directory: './logs/messages_data/',
  toConsole: conf.log.data,
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

function printf(...a) {
  return a.reduce((p, c) => {
    return p.replace(/%s/, c);
  });
}

// expected Array
// count everything in array
function countElement(array) {
  // custom what ever u want to count each element
  return array.reduce((total, e) => {
    /* return JSON.stringify(e).startsWith('{') ? total + 1 : 0; */
    return total + 1;
  }, 0);
}

module.exports = {
  log: log,
  dblog: dblog,
  devlog: devlog,
  datalog: datalog,
  isString: isString,
  jForm: jForm,
  precise: precise,
  wait: wait,
  decode64: decode64,
  encode64: encode64,
  printf: printf,
  countElement: countElement
};
