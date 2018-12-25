/**
 * @name AMU
 * @description call force/ call margin, process msg to jso nformat
 */

import * as util from '../lib/util';

/* 
RMU10170012 ,1,1,114632800,0,0,4,ABICO ,N, ,100,0.35,0.40,0.25,0.30,710,680,0,0,*,BANPU ,A, ,050,0.35,0.40,0.25,0.30,65000,1750,0,0,*,BLISS ,N, ,100,0.35,0.40,0.25,0.30,10000,4,0,0,*,CCP ,N,S,070,0.35,0.40,0.25,0.30,10000,36,0,0,*
 */

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
  let loopGap = 14;

  let jsonObj = jsonStr;
  let loopMultiplyGap = loopCount * loopGap;
  if (loopCount >= 0) {
    for (let i = 0; i < loopMultiplyGap; i += loopGap) {
      // start from 11, gap jump every 14
      let msgObj = {
        stock_symbol: String(buffer[11 + i]),
        grade: String(buffer[12 + i]),
        stock_type: String(buffer[13 + i]),
        mrg_code: String(buffer[14 + i]),
        call_lmv: String(buffer[15 + i]),
        call_smv: String(buffer[16 + i]),
        sell_lmv: String(buffer[17 + i]),
        sell_smv: String(buffer[18 + i]),
        actual_vol: String(buffer[19 + i]),
        lastsale: String(buffer[20 + i]),
        mkt_value: String(buffer[21 + i]),
        call_margin: String(buffer[22 + i]),
        call_force: String(buffer[23 + i]),
        ending_flag: String(buffer[24 + i])
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
  processAMU: processAMU
};
