/**
 * @name AMU
 * @description call force/ call margin, process msg to jso nformat
 */

'use strict';
import { decode64, encode64, devlog, log } from '../lib/util';

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

  // data preparation
  let loopGap = 14;
  let loopCount =
    Number.isInteger(buffer[6] * 1) && buffer[6] * 1 >= 0 ? buffer[6] * 1 : 0;
  let jsonObj = {
    MsgType: String(msgType),
    cust_no: String(buffer[0].slice(3, 12)),
    page: String(buffer[1]),
    total_page: String(buffer[2]),
    total_mkt: String(buffer[3]),
    total_call: String(buffer[4]),
    total_force: String(buffer[5]),
    loop_count: String(buffer[6]),
    data: []
  };

  let loopMultiplyGap = loopCount * loopGap;
  if (loopCount >= 0) {
    for (let i = 0; i < loopMultiplyGap; i += loopGap) {
      // start from 7, gap jump every 13
      let msgObj = {
        stock_symbol: String(buffer[7 + i]),
        grade: String(buffer[8 + i]),
        stock_type: String(buffer[9 + i]),
        mrg_code: String(buffer[10 + i]),
        call_lmv: String(buffer[11 + i]),
        call_smv: String(buffer[12 + i]),
        sell_lmv: String(buffer[13 + i]),
        sell_smv: String(buffer[14 + i]),
        actual_vol: String(buffer[15 + i]),
        lastsale: String(buffer[16 + i]),
        mkt_value: String(buffer[17 + i]),
        call_margin: String(buffer[18 + i]),
        call_force: String(buffer[19 + i]),
        ending_flag: String(buffer[20 + i])
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
