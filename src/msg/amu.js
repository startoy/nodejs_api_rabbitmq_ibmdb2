/**
 * @name AMU
 * @description call force/ call margin, process msg to jso nformat
 */

'use strict';
import { decode64, devlog, log } from '../lib/util';

function decodeAMU(msgType, reqObject) {
  if (!reqObject) return 0;

  // list of encode-decode var
  let custNo = decode64(reqObject['cust_no']);
  let trdId = decode64(reqObject['trd_id']);

  // list of non-encode var
  let stockSymbol = reqObject['stock_symbol'];
  let page = reqObject['page'];
  let pageSize = reqObject['page_size'];

  return stringAMU(msgType, trdId, custNo, stockSymbol, page, pageSize);
}

function processAMU(msgType, msgStr) {
  if (!msgStr) return 0;
  let buffer = msgStr.split(',');

  let jsonStr = {
    MsgType: String(msgType),
    TraderID: String(buffer[1]),
    TraderName: String(buffer[2]),
    cust_no: String(buffer[3]),
    cust_name: String(buffer[4]),
    page: String(buffer[5]),
    total_page: String(buffer[6]),
    total_mkt: String(buffer[7]),
    total_call: String(buffer[8]),
    total_force: String(buffer[9]),
    loop_count: String(buffer[10]),
    data: []
  };

  // field loop_count
  let loopCount =
    Number.isInteger(buffer[10] * 1) && buffer[10] * 1 >= 0
      ? buffer[10] * 1
      : 0;

  // loopGap calculate from total fields in loop
  let loopGap = 15;
  let jsonObj = jsonStr;
  let loopMultiplyGap = loopCount * loopGap;
  if (loopCount >= 0) {
    for (let i = 0; i < loopMultiplyGap; i += loopGap) {
      // start from index 11th, gap jump every 15
      let idx = +11;
      let msgObj = {
        stock_symbol: String(buffer[idx++ + i]),
        grade: String(buffer[idx++ + i]),
        stock_type: String(buffer[idx++ + i]),
        mrg_code: String(buffer[idx++ + i]),
        call_lmv: String(buffer[idx++ + i]),
        call_smv: String(buffer[idx++ + i]),
        sell_lmv: String(buffer[idx++ + i]),
        sell_smv: String(buffer[idx++ + i]),
        actual_vol: String(buffer[idx++ + i]),
        lastsale: String(buffer[idx++ + i]),
        mkt_value: String(buffer[idx++ + i]),
        call_margin: String(buffer[idx++ + i]),
        call_force: String(buffer[idx++ + i]),
        avg_cost: String(buffer[idx++ + i]),
        ending_flag: String(buffer[idx++ + i])
      };
      jsonObj.data.push(msgObj);
    }
  } else {
    log.info('Error : Loop count < 0');
  }
  log.info('Message [' + msgType + '] ' + ' return data object');
  return jsonObj;
}

function stringAMU(MsgType, trdId, custNo, stockSymbol, page, pageSize) {
  let str =
    MsgType +
    trdId.padEnd(4, ' ') +
    ',' +
    custNo.padEnd(10, ' ') +
    ',' +
    stockSymbol +
    ',' +
    page +
    ',' +
    pageSize;
  devlog.info('Decode to String: ' + str);
  // expected: AMU1017,10170012%20%20,BANPU,1,10
  return str;
}

module.exports = {
  decodeAMU: decodeAMU,
  processAMU: processAMU
};
