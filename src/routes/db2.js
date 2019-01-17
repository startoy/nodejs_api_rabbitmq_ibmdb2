/**
 * @name db2
 * @description router :url/db/...
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import * as db from '../lib/db2Function';
import * as conf from '../lib/config';
import { dblog, printf, catchJsonObject } from '../lib/util';
import { showIndex, getDB2ReqParamsAfterNext } from '../lib/routerFunction';

const router = express.Router();

router.use(handleReqDB2Router);
router.all('/', showIndex);
router.all('/querydb', queryDB);
router.all('/querystock', queryStock);
router.all('/querysec', querySec);
// util if needed
router.all('/queryrecords', queryRecords);
router.all('/querytotalpages', queryTotalPages);
router.use(handleResDB2Router);

// Handle all request through /db/
// identify method and store to locals then pass those to target route
async function handleReqDB2Router(req, res, next) {
  dblog.info('Request Received!');
  try {
    let fieldArray, table, secSymbol;
    let page, pageSize;
    if (req.method === 'POST') {
      fieldArray = req.body.fields || '*';
      table = req.body.table || conf.db2.table;
      secSymbol = req.body.secsymbol || '';
      page = req.body.page;
      pageSize = req.body.page_size;
    } else {
      fieldArray = req.query.fields || '*';
      table = req.query.table || conf.db2.table;
      secSymbol = req.query.secsymbol || '';
      page = req.query.page;
      pageSize = req.query.page_size;
    }

    dblog.info(printf('Request page[%s] page_size[%s]', page, pageSize));

    res.locals.fieldArray = fieldArray;
    res.locals.table = table.toUpperCase();
    res.locals.secsymbol = secSymbol.toUpperCase();
    res.locals.page = page;
    res.locals.page_size = pageSize;
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    res.json(jsonObj);
  }
  next();
}

async function handleResDB2Router(req, res, next) {
  try {
    // get data from previous route in res.locals.dataOfArray
    let data = res.locals.dataOfArray;

    // convert to json object format
    let jsonObj = await db.getJsonObj(data);

    dblog.info('Respond Sent!');
    res.json(jsonObj);
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    dblog.info('Respond Sent!');
    res.json(jsonObj);
  }
}

// FIX QUERY : query *
async function queryDB(req, res, next) {
  try {
    let {
      fieldArray,
      secSymbol,
      page,
      pageSize
    } = await getDB2ReqParamsAfterNext(res);
    let { from, to } = await db.calRangeFromPage(page, pageSize);
    let table = conf.db2.table;

    let queryStmnt = await db.createQueryCFRate(
      fieldArray,
      table,
      secSymbol,
      from,
      to
    );
    let jsonArray = await db.query(queryStmnt);

    // Logic

    // store data to be used next
    res.locals.dataOfArray = jsonArray;
    next();
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    res.json(jsonObj);
  }
}

// Fix query : only SECSYMBOL field
async function queryStock(req, res, next) {
  try {
    // Filter
    let { table, page, pageSize } = await getDB2ReqParamsAfterNext(res);
    let { from, to } = await db.calRangeFromPage(page, pageSize);
    let fieldArray = 'SECSYMBOL';

    // Operate
    let queryStmnt = await db.createQueryCFRate(
      fieldArray,
      table,
      '',
      from,
      to
    );
    let jsonArray = await db.query(queryStmnt);

    // Logic
    // get stock from each array
    let dataArray = db.getArrayOfValueFromKey(jsonArray, 'SECSYMBOL');

    // Store data to be used next
    res.locals.dataOfArray = dataArray;
    next();
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    res.json(jsonObj);
  }
}

// Universal filter query
async function querySec(req, res, next) {
  try {
    // Filter
    let { fieldArray, table, page, pageSize } = await getDB2ReqParamsAfterNext(
      res
    );
    let { from, to } = await db.calRangeFromPage(page, pageSize);

    // Operate
    let queryStmnt = await db.createQueryCFRate(
      fieldArray,
      table,
      '',
      from,
      to
    );
    let jsonArray = await db.query(queryStmnt);

    // Logic

    // Store data to be used next
    res.locals.dataOfArray = jsonArray;
    next();
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    res.json(jsonObj);
  }
}

// Query records from filter table by filter field
async function queryRecords(req, res, next) {
  try {
    // Filter
    let { fieldArray, table } = await getDB2ReqParamsAfterNext(res);

    // Operate
    let queryStmnt = await db.createQueryCountRecords(fieldArray, table);
    let jsonArray = await db.query(queryStmnt);

    // Logic

    // Store data to be used next
    res.locals.dataOfArray = jsonArray;
    next();
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    res.json(jsonObj);
  }
}

// Query records then calculate to total pages by page size
async function queryTotalPages(req, res, next) {
  try {
    // Filter
    let { fieldArray, table, pageSize } = await getDB2ReqParamsAfterNext(res);

    // Operate
    let queryStmnt = await db.createQueryCountRecords(fieldArray[0], table);
    let jsonArray = await db.query(queryStmnt);

    // Logic
    let totalRecords = db.getArrayOfValueFromKey(jsonArray, 'TOTAL');
    let totalPages = await db.calDBTotalPages(totalRecords, pageSize);

    // Store data to be used next
    res.locals.dataOfArray = Array(totalPages);
    next();
  } catch (e) {
    let jsonObj = catchJsonObject(e);
    res.json(jsonObj);
  }
}

module.exports = router;
