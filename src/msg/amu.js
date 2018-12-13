/**
 * @name AMU
 * @description call force/ call margin, process msg to jso nformat
 */

import * as util from '../lib/util';

function processAMU(msgType, msgStr) {
  if (!msgStr) return 0;
  var buffer = msgStr.split(',');
  util.log.info('NodeSend [' + msgType + '] ' + '[' + buffer + ']');
  return buffer;
}

module.exports = {
  processAMU: processAMU
};
