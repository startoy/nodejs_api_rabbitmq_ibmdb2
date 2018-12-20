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
    TotalBuy: buffer[6] * 1,
    TotalSell: buffer[7] * 1,
    buy_total_cr: buffer[8] * 1,
    sellorshortvalue: buffer[9] * 1,
    credit_limit: buffer[10] * 1
  };

  let jsonObj = jsonStr;

  util.log.info('Message [' + msgType + '] ' + ' return json data object');
  return jsonObj;
}

module.exports = {
  processAMT: processAMT
};
