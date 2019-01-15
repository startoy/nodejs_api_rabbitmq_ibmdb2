/**
 * @name rpc
 * @description router :url/rpc/...
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import client from '../lib/amqp';
import * as conf from '../lib/config';
import {
  __processMsgRecv,
  __processMsgSend,
  __processObjtoStr
} from '../msgManager';
import { log, devlog, datalog, wait } from '../lib/util';
import { showIndex } from '../lib/routerFunction';
import errr from '../error/type';

const router = express.Router();

let channel;
let conn;

async function main() {
  let uri = conf.AMQPURI;
  if (typeof uri === 'undefined' && !uri) {
    log.error('[ERROR] provided uri is not in proper format, got ' + uri);
    process.exit(1);
  }

  try {
    log.info(' [-] Trying to connect RabbitMQ with uri...' + uri);
    conn = await client.connect({
      uri: uri
    });
    log.info(' [-] Trying to create RabbitMQ channel...');
    channel = await client.create(conn);
  } catch (e) {
    if (e) log.error(e);
    log.info(" [-] Did RabbitMQ service's start ?");
    console.error(' [x]Creating channel failed: Termiated process..');
    process.exit(1);
  }
}

// TODO: might call this in app.js instead ?
main();

router.get('/', showIndex);
router.post('/query', queryOkury);

/**
 * @deprecated
 * in Development only !
 */
router.get('/:queueName/:message', async (req, res) => {
  try {
    const msgTypeRcv = req.params.message.slice(0, 3);
    const message = req.params.message;
    const queueName = req.params.queueName;

    if (!__processMsgRecv(msgTypeRcv, message)) {
      devlog.error('Error on __processMsgRecv');
      return res.json(errr.UNKNOWN_MESSAGE_TYPE);
    }

    devlog.info('Sending message[' + message + '] Queue[' + queueName + ']');
    devlog.info('Wait Time ' + conf.replyWaitTime + ' ms');
    datalog.info('RPCSend [' + msgTypeRcv + '] ' + '[' + message + ']');

    Promise.race([
      client.sendRPCMessage(channel, message, queueName),
      wait(conf.replyWaitTime)
    ]).then(val => {
      devlog.info('Promise Race Done');
      if (val) {
        let data = val.toString();
        let msgTypeRPCRcv = data.slice(0, 3);
        datalog.info('RPCRecv [' + msgTypeRPCRcv + '] ' + '[' + data + ']');
        let jsonData = __processMsgSend(data);
        res.json(jsonData);
        return;
      }
      res.json(errr.RESPONSE_TIMEOUT);
    });
  } catch (e) {
    if (e) log.error(e);
    res.json(errr.API_REQUEST_ERROR);
  }
});

async function queryOkury(req, res) {
  try {
    const msgType = req.body.msgType.slice(0, 3); // TypeError if not send field msgtype to this router
    const msgData = req.body;
    if (!__processMsgRecv(msgType, JSON.stringify(msgData))) {
      devlog.error('Error on __processMsgRecv');
      return res.json(errr.UNKNOWN_MESSAGE_TYPE);
    }

    // logic goes here...
    let dataString = __processObjtoStr(msgData);
    datalog.info('Router get ' + dataString);

    // promise race
    Promise.race([
      client.sendRPCMessage(channel, dataString, conf.rpcQueue),
      wait(conf.replyWaitTime)
    ]).then(val => {
      devlog.info('Promise Race Done');
      if (val) {
        let data = val.toString();
        let msgTypeRPCRcv = data.slice(0, 3);
        datalog.info('RPCRecv [' + msgTypeRPCRcv + '] ' + '[' + data + ']');
        let jsonData = __processMsgSend(data);
        res.json(jsonData);
        return;
      }
      res.json(errr.RESPONSE_TIMEOUT);
    });
  } catch (e) {
    let jsonObj = e ? errr.API_CUSTOM_ERROR : errr.API_REQUEST_ERROR;
    if (e) {
      log.error(e);
      jsonObj.message = e;
    }
    res.json(jsonObj);
  }
}

module.exports = router;
