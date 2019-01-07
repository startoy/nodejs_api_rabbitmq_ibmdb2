/**
 * @name connectDatabase
 * @description query from database ibm_db `db2`
 */

'use strict';
import { db2 } from '../lib/config';
import { log, devlog } from '../lib/util';
try {
  var ibmdb = require('ibm_db');
} catch (e) {
  throw e;
}

let connectionString = createDBConn(
  db2.name,
  db2.host,
  db2.user,
  db2.pwd,
  db2.port
);

devlog.info('DB2 Using Codepage: [' + db2.codepage + ']');
devlog.info('DB2 Connection String [' + connectionString + ']');

/**
 *
 * @param {*} queryStr SQL Query
 * @returns {jsonArray}
 */
async function query(queryStr) {
  return new Promise((resolve, reject) => {
    try {
      ibmdb.open(connectionString, (err, conn) => {
        if (err) {
          reject(err);
          return; // prevent continue reading code : asynchronous
        }

        if (!queryStr) {
          log.error('No query string provided');
          resolve(false);
        }

        conn.query(queryStr, (err, object) => {
          if (err) {
            reject(err);
            return;
          } else {
            let jsonArray = [];
            log.info('RecvDB2 => ' + JSON.stringify(object));

            if (JSON.stringify(object).startsWith('{')) jsonArray.push(object);
            else jsonArray = object;

            resolve(jsonArray);
          }

          conn.close(() => {
            log.warn('Connection Closed..');
          });
        });
      });
    } catch (e) {
      if (e) log.error('db catch' + e);
      devlog.error('Cannot open connection to IBM DB2...');
      reject(e);
    }
  });
}

/**
 *
 * @param {*} dbname Dtabase name
 * @param {*} hostname Server host name or ip
 * @param {*} uid Username
 * @param {*} pwd Password
 * @param {*} port Port
 */
function createDBConn(dbname, hostname, uid, pwd, port) {
  let str = '';
  str += 'DATABASE=' + dbname + ';';
  str += 'HOSTNAME=' + hostname + ';';
  str += 'UID=' + uid + ';';
  str += 'PWD=' + pwd + ';';
  str += 'PORT=' + port + ';';

  return str;
}

/**
 *
 * @param {jsonArray} jsonArray array[]
 * @returns {jsonObject} object{}
 */
function getJsonObj(jsonArray) {
  let jsonObj = {
    code: '0',
    message: 'success',
    data: []
  };
  for (const data in jsonArray) {
    if (jsonArray.hasOwnProperty(data)) {
      const element = jsonArray[data];
      jsonObj.data.push(element);
    }
  }
  return jsonObj;
}

function getValueArrayfromKey(jsonArray, keys) {
  let dataArray = [];
  for (const data in jsonArray) {
    if (jsonArray.hasOwnProperty(data)) {
      const element = jsonArray[data];
      dataArray.push(element[keys].replace(/ /g, ''));
    }
  }
  return dataArray;
}

/**
 *
 * @param {*} jsonArray array[]
 * @param {*} keys any
 * @returns {jsonArray} array[]
 */
function getKeyValueArrayfromKey(jsonArray, keys) {
  let dataArray = [];
  for (const data in jsonArray) {
    if (jsonArray.hasOwnProperty(data)) {
      const element = jsonArray[data];
      let tmp = {};
      tmp[keys] = element[keys];
      dataArray.push(tmp);
    }
  }
  return dataArray;
}

module.exports = {
  query: query,
  getJsonObj: getJsonObj,
  getKeyValueArrayfromKey: getKeyValueArrayfromKey,
  getValueArrayfromKey: getValueArrayfromKey
};
