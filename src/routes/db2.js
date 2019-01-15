/**
 * @name db2
 * @description router :url/db/...
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import * as db from '../lib/db2Function';
import * as conf from '../lib/config';
import { log, devlog, datalog, printf } from '../lib/util';
import { showIndex, getDB2ReqParamsAfterNext } from '../lib/routerFunction';
import errr from '../error/type';

const router = express.Router();

router.use(handleReqDB2Router);
router.all('/', showIndex);
router.all('/querydb', queryDB);
router.all('/querystock', queryStock);
router.all('/querysec', querySec);

// util if needed
router.all('/queryrecords', queryRecords);
router.all('/querytotalpages', queryTotalPages);

// Handle all request through /db/
// identify method and store to locals then pass those to target route
async function handleReqDB2Router(req, res, next) {
  try {
    console.log('ENTER handleReqDB2Router');
    let fieldsArray, table, from, to;
    let page, pageSize;
    if (req.method === 'POST') {
      fieldsArray = req.body.fields || '*';
      table = req.body.table || conf.db2.table;
      page = req.body.page || null;
      pageSize = req.body.page_size || null;

      // for dev
      from = req.body.from || null;
      to = req.body.to || null;
    } else {
      fieldsArray = req.query.fields || '*';
      table = req.query.table || conf.db2.table;
      page = req.query.page || null;
      pageSize = req.query.page_size || null;

      // for dev
      from = req.query.from || null;
      to = req.query.to || null;
    }

    res.locals.fieldsArray = fieldsArray;
    res.locals.table = table.toUpperCase();
    res.locals.page = page;
    res.locals.page_size = pageSize;
    res.locals.from = from;
    res.locals.to = to;

    console.log('fieldsArray=' + fieldsArray + typeof fieldsArray);
    console.log('table=' + table + typeof table);
    console.log('page=' + page + typeof page);
    console.log('pageSize=' + pageSize + typeof pageSize);
    console.log('ForInDev --> from=' + from + typeof from);
    console.log('ForInDev --> to=' + to + typeof to);
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
  next();
}

// FIX QUERY : query *
async function queryDB(req, res) {
  try {
    let { page, pageSize } = await getDB2ReqParamsAfterNext(res);
    let { from, to } = await db.calRangeFromPage(page, pageSize);
    let fieldsArray = '*';
    let table = conf.db2.table;
    let queryStmnt = await db.createQueryCFRate(fieldsArray, table, from, to);
    devlog.info('QueryString:' + queryStmnt);

    let jsonArray = await db.query(queryStmnt);
    // logic goes here...

    // convert to json object format
    let jsonObj = db.getJsonObj(jsonArray);
    datalog.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

// FIX QUERY:query only SECSYMBOL field
async function queryStock(req, res) {
  try {
    let { table } = await getDB2ReqParamsAfterNext(res);
    let fieldsArray = 'SECSYMBOL';
    let queryStmnt = await db.createQueryCFRate(fieldsArray, table);
    devlog.info('QueryString:' + queryStmnt);
    let jsonArray = await db.query(queryStmnt);

    // get stock from each array
    let dataArray = db.getArrayOfValueFromKey(jsonArray, 'SECSYMBOL');

    // convert to json object format
    let jsonObj = db.getJsonObj(dataArray);
    datalog.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

// Universal filter query
async function querySec(req, res) {
  try {
    let { fieldsArray, table, page, pageSize } = await getDB2ReqParamsAfterNext(
      res
    );
    let { from, to } = await db.calRangeFromPage(page, pageSize);
    let queryStmnt = await db.createQueryCFRate(fieldsArray, table, from, to);
    devlog.info('QueryString:' + queryStmnt);
    let jsonArray = await db.query(queryStmnt);

    // convert to json object format
    let jsonObj = db.getJsonObj(jsonArray);
    datalog.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

async function queryRecords(req, res) {
  try {
    let { fieldsArray, table } = await getDB2ReqParamsAfterNext(res);
    let queryStmnt = await db.createQueryCountRecords(fieldsArray, table);
    devlog.info('QueryString:' + queryStmnt);
    let jsonArray = await db.query(queryStmnt);

    // convert to json object format
    let jsonObj = db.getJsonObj(jsonArray);
    datalog.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;

    log.error(e);
    jsonObj.message = e;

    res.json(jsonObj);
  }
}

// total_records/rec_per_page
async function queryTotalPages(req, res) {
  try {
    let { fieldsArray, table, pageSize } = await getDB2ReqParamsAfterNext(res);
    let queryStmnt = await db.createQueryCountRecords(fieldsArray[0], table);
    devlog.info('QueryString:' + queryStmnt);
    let jsonArray = await db.query(queryStmnt);
    let totalRecords = db.getArrayOfValueFromKey(jsonArray, 'TOTAL');
    let totalPages = await db.calDBTotalPages(totalRecords, pageSize);

    // convert to json object format
    let jsonObj = db.getJsonObj(totalPages);
    datalog.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

module.exports = router;
