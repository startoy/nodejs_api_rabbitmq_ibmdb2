import { sv } from './config';

async function showIndex(req, res, next) {
  res.json({ code: 0, message: 'made a request successfully !!', data: [] });
}

async function showVersion(req, res, next) {
  res.json(sv);
}

async function setResHeader(req, res, next) {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

async function getDB2ReqParamsAfterNext(res) {
  let fieldArray, table, secSymbol, from, to, page, pageSize;
  fieldArray = res.locals.fieldArray;
  table = res.locals.table;
  secSymbol = res.locals.secsymbol;
  from = res.locals.from;
  to = res.locals.to;
  page = res.locals.page;
  pageSize = res.locals.page_size;

  return {
    fieldArray,
    table,
    secSymbol,
    page,
    pageSize,
    from,
    to
  };
}

module.exports = {
  getDB2ReqParamsAfterNext: getDB2ReqParamsAfterNext,
  showIndex: showIndex,
  showVersion: showVersion,
  setResHeader: setResHeader
};
