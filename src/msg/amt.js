/**
 * @name AMT
 * @description CALL REQUEST ,,,
 */

import * as util from '../lib/util';

function processAMT(msgType, msgStr) {
  if (!msgStr) return 0;
  let buffer = msgStr.split(',');

  let jsonStr = {
    MsgType: msgType,
    cust_no: String(buffer[0].slice(3, 13)),
    PC: String(buffer[1]),
    cust_type: String(buffer[2]),
    credit_type: String(buffer[3]),
    trader_char: String(buffer[4]),
    trader_name: String(buffer[5]),
    TotalBuy: String(buffer[6]),
    TotalSell: String(buffer[7]),
    buy_total_cr: String(buffer[8]),
    sellorshortvalue: String(buffer[9]),
    credit_limit: String(buffer[10])
  };

  let jsonObj = jsonStr;

  util.log.info('Message [' + msgType + '] ' + ' return json data object');
  return jsonObj;
}

module.exports = {
  processAMT: processAMT
};
