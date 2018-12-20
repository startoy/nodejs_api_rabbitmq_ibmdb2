/**
 * @name AXX
 * @description TEMPLATE FOR WRITE A NEW MESSAGE
 */

import * as util from '../lib/util';

function processAXX(msgType, msgStr) {
  if (!msgStr) return 0;
  let buffer = msgStr.split(',');

  // data preparation
  let loopGap = 13;
  let loopCount =
    Number.isInteger(buffer[6] * 1) && buffer[6] * 1 >= 0 ? buffer[6] * 1 : 0;
  let jsonStr = {
    MsgType: String(buffer[0].slice(0, 3)),
    cust_no: String(buffer[0].slice(3, 12)),
    page: buffer[1] * 1,
    total_page: buffer[2] * 1,
    total_mkt: buffer[3] * 1,
    total_call: buffer[4] * 1,
    total_force: buffer[5] * 1,
    loop_count: buffer[6] * 1,
    data: []
  };

  let jsonObj = jsonStr;
  let loopMultiplyGap = loopCount * loopGap;
  if (loopCount >= 0) {
    for (let i = 0; i < loopMultiplyGap; i += loopGap) {
      // start from 7, gap jump every 13
      let msgObj = {
        stock_symbol: String(buffer[7 + i]),
        grade: String(buffer[8 + i]),
        stock_type: String(buffer[9 + i]),
        mrg_code: buffer[10 + i].padStart(3, '0'),
        /* call_lmv: Number(buffer[11 + i]).toFixed(2), */
        call_lmv: buffer[11 + i] * 1,
        call_smv: buffer[12 + i] * 1,
        sell_lmv: buffer[13 + i] * 1,
        sell_smv: buffer[14 + i] * 1,
        actual_vol: buffer[15 + i] * 1,
        lastsale: buffer[16 + i] * 1,
        call_margin: buffer[17 + i] * 1,
        call_force: buffer[18 + i] * 1,
        ending_flag: String(buffer[19 + i])
      };
      jsonObj.data.push(msgObj);
    }
  } else {
    util.log.info('Error : Loop count < 0');
  }
  util.log.info('Message [' + msgType + '] ' + ' return data object');
  return jsonObj;
}

module.exports = {
  processAXX: processAXX
};