/**
 * @name processMsg
 * @description router :url/rpc/:requestString
 */

'use strict';

import * as amu from './msg/amu';
import * as axx from './msg/axx';

import * as util from './lib/util';

const msgFunction = [
  { msg: 'XX', func: axx.processAXX },
  { msg: 'MU', func: amu.processAMU }
];

// AMU1017,10170012  ,1,10
function __processMsgRecv(msg) {
  const msgType3 = msg.slice(0, 3);
  const msgType = msg.slice(1, 3);
  util.log.info('NodeRecv [' + msgType3 + '] ' + msg);
  if (
    msgFunction.some(e => {
      if (msgType === e.msg) {
        return true;
      }
    })
  )
    return 1;
  else {
    util.log.error(
      'undefined function msg: ' + msgType3 + '. Invalid format ?'
    );
    return 0;
  }
}

function __processMsgSend(msg) {
  const msgType3 = msg.slice(0, 3);
  const msgType = msg.slice(1, 3);
  const index = msgFunction.findIndex(e => {
    if (msgType === e.msg) {
      return e;
    }
  });
  // util.log.info('index:' + index + ' type:' + typeof index);
  if (util.isNumber(index) && !(index <= 0)) {
    try {
      return msgFunction[index].func(msgType3, msg);
    } catch (e) {
      let err = '';
      if (e) err = e;
      util.log.error('[output] Failed ' + err);
      return util.jForm(err);
    }
  } else {
    let err = 'receive rpc msg with wrong format';
    util.log.error('undefined function msg: ' + msgType3);
    return util.jForm(err);
  }
}

module.exports = {
  __processMsgRecv: __processMsgRecv,
  __processMsgSend: __processMsgSend
};
