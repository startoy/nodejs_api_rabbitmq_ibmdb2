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

let jsonString = {
  code: '0',
  message: 'success',
  data: []
};

devlog.info('DB2 Using Codepage: [' + db2.codepage + ']');
devlog.info('DB2 Connection String [' + connectionString + ']');

async function query(queryStr) {
  if (!queryStr) log.warn('No query string provided');
  return new Promise((resolve, reject) => {
    try {
      ibmdb.open(connectionString, (err, conn) => {
        if (err) {
          reject(err);
          return; // prevent continue reading code : asynchronous
        }

        conn.query(queryStr, (err, object) => {
          if (err) {
            reject(err);
            return;
          } else {
            log.info('DB2Recv => ' + JSON.stringify(object));

            for (const data in object) {
              if (object.hasOwnProperty(data)) {
                const element = object[data];
                jsonString.data.push(element);
              }
            }

            devlog.info('DB2Resolved => ' + JSON.stringify(jsonString));
            resolve(jsonString);
          }

          conn.close(() => {
            log.info('Connection Close...');
          });
        });
      });
    } catch (e) {
      if (e) log.error('db catch' + e);
      devlog.info('Cannot open ibm db connection');
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

module.exports = {
  query: query
};
