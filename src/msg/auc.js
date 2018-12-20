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
    found_flag: String(buffer[0].slice(-1)),
    cust_no: String(buffer[1]),
    cust_name: String(buffer[2]),
    credit_limit: String(buffer[3]),
    buy_total_credit: String(buffer[4]),
    sell_cr: String(buffer[5]),
    cash_balance: String(buffer[6]),
    collateral: String(buffer[7]),
    start_debt: String(buffer[8]),
    ar: String(buffer[9]),
    ap: String(buffer[10]),
    BuyUnmatch: String(buffer[11]),
    SellUnmatch: String(buffer[12]),
    cust_code: String(buffer[13]),
    motherCredit: String(buffer[14])
  };

  let jsonObj = jsonStr;

  util.log.info('Message [' + msgType + '] ' + ' return json data object');
  return jsonObj;
}

module.exports = {
  processAUC: processAUC
};
