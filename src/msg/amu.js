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

  // data preparation
  let loopGap = 13;
  let loopCount =
    Number.isInteger(Number(buffer[6])) && Number(buffer[6] >= 0)
      ? Number(buffer[6])
      : 0;
  let jsonStr = {
    MsgType: String(buffer[0].slice(0, 3)),
    cust_no: String(buffer[0].slice(3, 12)),
    page: Number(buffer[1]),
    total_page: Number(buffer[2]),
    total_mkt: Number(buffer[3]),
    total_call: Number(buffer[4]),
    total_force: Number(buffer[5]),
    loop_count: Number(buffer[6]),
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
        call_lmv: Number(buffer[11 + i]),
        call_smv: Number(buffer[12 + i]),
        sell_lmv: Number(buffer[13 + i]),
        sell_smv: Number(buffer[14 + i]),
        actual_vol: Number(buffer[15 + i]),
        lastsale: Number(buffer[16 + i]),
        call_margin: Number(buffer[17 + i]),
        call_force: Number(buffer[18 + i]),
        ending_flag: String(buffer[19 + i])
      };
      jsonObj.data.push(msgObj);
    }
  } else {
    util.log.info('  ');
  }

  util.log.info(
    'NodeSend [' + msgType + '] ' + 'Obj:[' + JSON.stringify(jsonObj) + ']'
  );
  return jsonObj;
}

module.exports = {
  processAMU: processAMU
};
