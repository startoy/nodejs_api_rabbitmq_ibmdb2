/**
 * @name connectDatabase
 * @description query from database ibm_db `db2`
 */

'use strict';
import { db2 } from './config';
import { log, devlog, datalog, printf } from './util';
import ibmdb from 'ibm_db';

let connectionString = createDBConn(
  db2.name,
  db2.host,
  db2.user,
  db2.pwd,
  db2.port
);

devlog.info(' [-] DB2 Using Codepage: [' + db2.codepage + ']');
devlog.info(' [-] DB2 Connection String [' + connectionString + ']');

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
            datalog.info('RecvDB2 => ' + JSON.stringify(object));

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
 * create connection string to connect to ibm db2
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

/**
 *
 * @param {*} jsonArray array[]
 * @param {*} keys any
 * @returns {jsonArray} array[]
 * @example keys=message [{ code : 10, message : 'The Flash' }, { code : 5, message : 'The Arrow' }]  return [ 'The Flash', 'The Arrow' ]
 */
function getArrayOfValueFromKey(jsonArray, keys) {
  let dataArray = [];
  for (const data in jsonArray) {
    if (jsonArray.hasOwnProperty(data)) {
      const element = jsonArray[data];
      dataArray.push(element[keys].toString().replace(/ /g, ''));
    }
  }
  return dataArray;
}

/**
 *
 * @param {*} jsonArray array[]
 * @param {*} keys any
 * @returns {jsonArray} array[]
 * @example keys=message [{ code : 10, message : 'The Flash' }, { code : 5, message : 'The Arrow' }]  return [ {message : 'The Flash'}, {message : 'The Arrow'} ]
 */
function getArrayOfJsonObjFromKey(jsonArray, keys) {
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

/**
 * dynamic create query string from table as page
 * @param {Array} fieldsArray
 * @param {String} table
 * @param {Number} from
 * @param {Number} to
 */
async function createQueryCFRate(fieldsArray, table, from, to) {
  let result = new Error();
  let whereClause = '';
  from = +from;
  to = +to;
  try {
    if (!table || !fieldsArray) return result;
    if (+from || +to) {
      // fetch from n1 to n2
      if (+from && +to && +from <= +to && +from >= 0 && +to > 0)
        whereClause = 'WHERE R BETWEEN ' + +from + ' AND ' + +to;
      // fetch from 0 to n2
      else if (!+from && +to && +to > 0)
        whereClause = 'FETCH FIRST ' + +to + ' ROWS ONLY ';
      else return result;
    } else if (!+from && !+to) whereClause = '';
    else return result;

    result =
      'SELECT ' +
      fieldsArray +
      ' FROM ( SELECT T.*, ROW_NUMBER() OVER(ORDER BY SECSYMBOL) R FROM ' +
      table +
      ' T  ) ' +
      whereClause;

    return result;
  } catch (e) {
    if (e) log.error(e);
    return false;
  }
}

/**
 * create query string get total records of specific table
 * @param {*} field
 * @param {*} table
 */
async function createQueryCountRecords(field, table) {
  return printf(
    'SELECT COUNT(%s) AS TOTAL FROM %s ORDER BY TOTAL',
    field,
    table
  );
}

async function calDBTotalPages(records, pageSize) {
  let pSize = pageSize || global.pageSize;
  return { total: Math.ceil(+records / pSize) };
}

async function calRangeFromPage(page, pageSize) {
  let pSize = pageSize || global.pageSize;
  let from, to;
  if (page <= 0 || pSize <= 0) {
    from = null;
    to = null;
  } else {
    from = pSize * page + 1 - pSize;
    to = pSize * page;
  }

  return { from, to };
}
module.exports = {
  query: query,
  getJsonObj: getJsonObj,
  getArrayOfJsonObjFromKey: getArrayOfJsonObjFromKey,
  getArrayOfValueFromKey: getArrayOfValueFromKey,
  createQueryCFRate: createQueryCFRate,
  createQueryCountRecords: createQueryCountRecords,
  calDBTotalPages: calDBTotalPages,
  calRangeFromPage: calRangeFromPage
};
