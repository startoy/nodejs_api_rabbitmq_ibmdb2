/**
 * @name db2
 * @description router :url/db/...
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import * as db from '../lib/db2Function';
import * as conf from '../lib/config';
import { log, dblog, printf } from '../lib/util';
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
router.use(handleResDB2Router);

// Handle all request through /db/
// identify method and store to locals then pass those to target route
async function handleReqDB2Router(req, res, next) {
  dblog.info('Request Received!');
  try {
    let fieldsArray, table, from, to;
    let page, pageSize;
    if (req.method === 'POST') {
      fieldsArray = req.body.fields || '*';
      table = req.body.table || conf.db2.table;
      page = req.body.page;
      pageSize = req.body.page_size;

      // for dev
      from = req.body.from || null;
      to = req.body.to || null;
    } else {
      fieldsArray = req.query.fields || '*';
      table = req.query.table || conf.db2.table;
      page = req.query.page;
      pageSize = req.query.page_size;

      // for dev
      from = req.query.from || null;
      to = req.query.to || null;
    }

    dblog.info(printf('Request page[%s] page_size[%s]', page, pageSize));

    res.locals.fieldsArray = fieldsArray;
    res.locals.table = table.toUpperCase();
    res.locals.page = page;
    res.locals.page_size = pageSize;
    res.locals.from = from;
    res.locals.to = to;
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

async function handleResDB2Router(req, res, next) {
  dblog.info('Respond Sent!');
  try {
    // get data from previous route in res.locals.dataNext
    let data = res.locals.dataNext;

    // convert to json object format
    let jsonObj = db.getJsonObj(data);
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

// FIX QUERY : query *
async function queryDB(req, res, next) {
  try {
    let { page, pageSize } = await getDB2ReqParamsAfterNext(res);
    let { from, to } = await db.calRangeFromPage(page, pageSize);
    let fieldsArray = '*';
    let table = conf.db2.table;

    let queryStmnt = await db.createQueryCFRate(fieldsArray, table, from, to);
    let jsonArray = await db.query(queryStmnt);

    // Logic

    // store data to be used next
    res.locals.dataNext = jsonArray;
    next();
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

// Fix query : only SECSYMBOL field
async function queryStock(req, res, next) {
  try {
    // Filter
    let { table, page, pageSize } = await getDB2ReqParamsAfterNext(res);
    let { from, to } = await db.calRangeFromPage(page, pageSize);
    let fieldsArray = 'SECSYMBOL';

    // Operate
    let queryStmnt = await db.createQueryCFRate(fieldsArray, table, from, to);
    let jsonArray = await db.query(queryStmnt);

    // Logic
    // get stock from each array
    let dataArray = db.getArrayOfValueFromKey(jsonArray, 'SECSYMBOL');

    // Store data to be used next
    res.locals.dataNext = dataArray;
    next();
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
async function querySec(req, res, next) {
  try {
    // Filter
    let { fieldsArray, table, page, pageSize } = await getDB2ReqParamsAfterNext(
      res
    );
    let { from, to } = await db.calRangeFromPage(page, pageSize);

    // Operate
    let queryStmnt = await db.createQueryCFRate(fieldsArray, table, from, to);
    let jsonArray = await db.query(queryStmnt);

    // Logic

    // Store data to be used next
    res.locals.dataNext = jsonArray;
    next();
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

// Query records from filter table by filter field
async function queryRecords(req, res, next) {
  try {
    // Filter
    let { fieldsArray, table } = await getDB2ReqParamsAfterNext(res);

    // Operate
    let queryStmnt = await db.createQueryCountRecords(fieldsArray, table);
    let jsonArray = await db.query(queryStmnt);

    // Logic

    // Store data to be used next
    res.locals.dataNext = jsonArray;
    next();
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }

    res.json(jsonObj);
  }
}

// Query records then calculate to total pages by page size
async function queryTotalPages(req, res, next) {
  try {
    // Filter
    let { fieldsArray, table, pageSize } = await getDB2ReqParamsAfterNext(res);

    // Operate
    let queryStmnt = await db.createQueryCountRecords(fieldsArray[0], table);
    let jsonArray = await db.query(queryStmnt);

    // Logic
    let totalRecords = db.getArrayOfValueFromKey(jsonArray, 'TOTAL');
    let totalPages = await db.calDBTotalPages(totalRecords, pageSize);

    // Store data to be used next
    res.locals.dataNext = totalPages;
    next();
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
