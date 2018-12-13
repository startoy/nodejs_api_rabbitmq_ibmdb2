/**
 * @name AXX
 * @description call force/ call margin
 */

import * as util from '../lib/util';

function processAXX(msgType, msgStr) {
  if (!msgStr) return 0;
  util.log.info('Recv [R' + msgType + '] ' + msgStr);
  var buffer = msgStr.split(',');
  util.log.info('Send [' + buffer[0] + ']');
  return buffer;
}

module.exports = {
  processAXX: processAXX
};
