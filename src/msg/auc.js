/**
 * @name AUC
 * @description CALL REQUEST ...
 */

import * as util from '../lib/util';

function processAUC(msgType, msgStr) {
  if (!msgStr) return 0;
  let buffer = msgStr.split(',');

  let jsonStr = {
    MsgType: msgType,
    found_flag: String(buffer[0].slice(-1)) * 1,
    cust_no: String(buffer[1]),
    cust_name: String(buffer[2]),
    credit_limit: buffer[3] * 1,
    buy_total_credit: buffer[4] * 1,
    sell_cr: buffer[5] * 1,
    cash_balance: buffer[6] * 1,
    collateral: buffer[7] * 1,
    start_debt: buffer[8] * 1,
    ar: buffer[9] * 1,
    ap: buffer[10] * 1,
    BuyUnmatch: buffer[11] * 1,
    SellUnmatch: buffer[12] * 1,
    cust_code: String(buffer[13]),
    motherCredit: buffer[14] * 1
  };

  let jsonObj = jsonStr;

  util.log.info('Message [' + msgType + '] ' + ' return json data object');
  return jsonObj;
}

module.exports = {
  processAUC: processAUC
};
