/**
 * @name processMsg
 * @description router :url/rpc/:requestString
 */

'use strict';

// Include messages
import * as axx from './msg/axx';
import * as amu from './msg/amu';
import * as auc from './msg/auc';
import * as amt from './msg/amt';

// Util
import * as util from './lib/util';
import errr from './error/type';

const msgFunction = [
  { msg: 'XX', func: axx.processAXX },
  { msg: 'MU', func: amu.processAMU },
  { msg: 'UC', func: auc.processAUC },
  { msg: 'MT', func: amt.processAMT }
];

function __processMsgRecv(msg) {
  const msgType3 = msg.slice(0, 3);
  const msgType = msg.slice(1, 3);
  util.log.info('NodeRecv [' + msgType3 + '] ' + msg);
  if (
    msgFunction.some(e => {
      if (msgType === e.msg) {
        return true;
      }
    }) &&
    msg.slice(0, 1) === 'A'
  )
    return 1;
  else {
    util.log.error(
      '__processMsgRecv error : undefined function msg: ' +
        msgType3 +
        '. Invalid format ?'
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

  if (Number.isInteger(index) && !(index <= 0)) {
    try {
      // expected json object
      const jsonObj = msgFunction[index].func(msgType3, msg);
      util.log.info(
        'NodeSend [' + msgType3 + '] ' + 'Obj:[' + JSON.stringify(jsonObj) + ']'
      );
      return jsonObj;
    } catch (e) {
      let err = '';
      if (e) err = e;
      util.log.error('[output] error: ' + err);
      return errr.OUTPUT_ERROR;
    }
  } else {
    let err = 'Invalid msg format';
    util.log.error(err + ' :' + msgType3);
    return errr.UNKNOWN_MESSAGE_TYPE;
  }
}

module.exports = {
  __processMsgRecv: __processMsgRecv,
  __processMsgSend: __processMsgSend
};
