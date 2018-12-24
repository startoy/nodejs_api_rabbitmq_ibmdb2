/**
 * @name processMsg
 * @description router :url/rpc/:requestString
 */

'use strict';

// Include messages
import * as amu from './msg/amu';
import * as rer from './msg/rer';

// Util
import { log, devlog } from './lib/util';
import errr from './error/type';

const msgFunction = [
  { msg: 'MU', funcIn: amu.decodeAMU, funcOut: amu.processAMU },
  { msg: 'ER', funcIn: rer.decodeRER, funcOut: rer.processRER }
];

/**
 * @param {*} msgType string
 * @param {*} msgData string
 */
function __processMsgRecv(msgType, msgData) {
  const msg = msgData !== undefined ? msgData : 'No provided data';
  devlog.info('Get ' + msgData + ' Type' + typeof msgData);
  log.info('NodeRecv [' + msgType + '] [' + msg + ']');

  if (checkMsgExist(msgType.slice(1, 3)) && msgType.slice(0, 1) === 'A')
    return 1;
  else {
    log.error(
      '__processMsgRecv error : undefined function msg: ' +
        msgType +
        '. Invalid format ?'
    );
    return 0;
  }
}

/**
 * process the POST request of each msg type to be a string then sent to server c
 * @param {*} reqObject jsonObject
 */
function __processObjtoStr(reqObject) {
  // check msg
  // var keys = Object.keys(reqObject);
  // devlog.info(keys.toString());
  var keys = 'msgType';
  const msgType = reqObject[keys].slice(0, 3); // ex. AMU
  const msgType2 = reqObject[keys].slice(1, 3); // ex. MU
  const index = getIndexFromMsg(msgType2);
  console.log(index);
  const str = msgFunction[index].funcIn(msgType, reqObject);
  return str;
}

function __processMsgSend(msg) {
  const msgType3 = msg.slice(0, 3);
  const msgType = msg.slice(1, 3);
  const index = getIndexFromMsg(msgType);

  if (index >= 0 && msgType3.slice(0, 1) === 'R') {
    try {
      // Call msg function
      const jsonObj = msgFunction[index].funcOut(msgType3, msg);
      log.info(
        'NodeSend [' + msgType3 + '] ' + 'Obj:[' + JSON.stringify(jsonObj) + ']'
      );
      // expected json object
      return jsonObj;
    } catch (e) {
      let err = '';
      if (e) err = e;
      log.error('[output] error: ' + err);
      return errr.OUTPUT_ERROR;
    }
  } else {
    let err = 'Invalid msg format';
    log.error(err + ' :' + msgType3);
    return errr.UNKNOWN_MESSAGE_FROM_SERVER_TYPE;
  }
}

function checkMsgExist(msgType) {
  return msgFunction.some(e => {
    if (msgType === e.msg) return true;
    return false;
  });
}

function getIndexFromMsg(msgType) {
  return msgFunction.findIndex(e => {
    if (msgType === e.msg) return e;
    return 0;
  });
}

module.exports = {
  __processMsgRecv: __processMsgRecv,
  __processMsgSend: __processMsgSend,
  __processObjtoStr: __processObjtoStr
};
