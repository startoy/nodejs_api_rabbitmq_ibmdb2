/**
 * @name connectDatabase
 * @description query from database ibm_db `db2`
 */

'use strict';
import { db } from '../lib/config';
var ibmdb = require('ibm_db');

let connectionString = createDBConn(db.name, db.ip, db.user, db.pwd, db.port);

async function query(queryStr) {
  if (!queryStr) queryStr = 'SELECT * FROM SECCALLFORCERATETAB;';
  ibmdb.open(connectionString, function(err, conn) {
    if (err) return console.log(err);

    conn.query(queryStr, function(err, data) {
      if (err) console.log(err);
      else console.log(data);

      conn.close(function() {
        console.log('done');
      });
    });
  });
}

function createDBConn(dbname, hostname, uid, pwd, port) {
  let str = 'DATABASE=' + dbname + ';';
  str += 'HOSTNAME=' + hostname + ';';
  str += 'UID=' + uid + ';';
  str += 'PWD=' + pwd + ';';
  str += 'PORT=' + port + ';';
  str += 'PROTOCOL=TCPIP';

  return str;
}

module.exports = {
  query: query
};
