/**
 * @name connectDatabase
 * @description query from database ibm_db `db2`
 */

'use strict';
import { db } from '../lib/config';
import { log, devlog } from '../lib/util';

var ibmdb = require('ibm_db');

let connectionString = createDBConn(db.name, db.host, db.user, db.pwd, db.port);
devlog.info('DB2 Using Codepage: [' + db.codepage + ']');
devlog.info('DB2 Connection String [' + connectionString + ']');

async function query(queryStr) {
  if (!queryStr) log.warn('No query string provided');
  ibmdb.open(connectionString, (err, conn) => {
    if (err) {
      log.error(err);
      return err;
    }

    conn.query(queryStr, (err, data) => {
      if (err) {
        log.error(err);
        return err;
      } else {
        conn.close(() => {
          log.info('Query Done');
          return data;
        });
      }
    });
  });
}

function createDBConn(dbname, hostname, uid, pwd, port) {
  let str = 'DATABASE=' + dbname + ';';
  str += 'HOSTNAME=' + hostname + ';';
  str += 'UID=' + uid + ';';
  str += 'PWD=' + pwd + ';';
  str += 'PORT=' + port + ';';

  return str;
}

module.exports = {
  query: query
};
