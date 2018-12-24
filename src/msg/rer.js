/**
 * @name AXX
 * @description TEMPLATE FOR WRITE A NEW MESSAGE
 */

import * as util from '../lib/util';
// input
function decodeRER(reqObject) {
  // pass
}

// output
/* expected 
[RER,1,AMU,AMU: Fail to read account [1017]]
[RER,1,AMU,read message not complete]  */

function processRER(msgType, msgStr) {
  if (!msgStr) return 0;
  let buffer = msgStr.split(',');

  let jsonObj = {
    msgType: msgType,
    code: String(buffer[1]),
    errMsgType: String(buffer[2]),
    message: String(buffer[3])
  };

  util.log.info('Message [' + msgType + '] ' + ' return json data object');
  return jsonObj;
}

module.exports = {
  processRER: processRER
};
