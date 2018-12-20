/**
 * @name rpc
 * @description router :url/rpc/:requestString
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import client from '../lib/amqp';
import * as cnf from '../lib/config';
import {
  __processMsgRecv,
  __processMsgSend,
  __processMsgType
} from '../msgManager';
import { log, devlog, wait, jForm } from '../lib/util';
import errr from '../error/type';
import { utils } from 'mocha';

const router = express.Router();

let channel;
let conn;

async function main() {
  let uri = cnf.AMQPURI;
  if (typeof uri === 'undefined' && !uri) {
    log.error('[ERROR] provided uri is not in proper format, got ' + uri);
    process.exit(1);
  }

  try {
    log.info('Trying to connect with uri...' + uri);
    conn = await client.connect({
      uri: uri
    });
    log.info('Trying to create channel...');
    channel = await client.create(conn);
  } catch (e) {
    if (e) log.error(e);
    log.info('Did RabbitMQ service start ?');
    log.error('Creating channel failed: Termiated process..');
    process.exit(1);
  }
}

// TODO: might call this in app.js instead ?
main();

router.get('/', async (req, res, next) => {
  res.render('index', {
    title: 'THIS IS MESSAGE FROM ROUTER INDEX PAGE, YOU SHOULD SEE THIS MESSAGE'
  });
});

router.get('/:queueName/:message', async (req, res) => {
  try {
    const msgTypeRcv = req.params.message.slice(0, 3);
    if (!__processMsgRecv(req.params.message)) {
      devlog.error('Error on __processMsgRecv');
      return res.json(errr.UNKNOWN_MESSAGE_TYPE);
    }
    const message = req.params.message;
    const queueName = req.params.queueName;
    devlog.info('Sending message[' + message + '] Queue[' + queueName + ']');
    devlog.info('Wait Time ' + cnf.replyWaitTime + ' ms');
    log.info('RPCSend [' + msgTypeRcv + '] ' + '[' + message + ']');
    Promise.race([
      client.sendRPCMessage(channel, message, queueName),
      wait(cnf.replyWaitTime)
    ]).then(val => {
      devlog.info('Promise Race Done');
      if (val) {
        let data = val.toString();
        let msgTypeRPCRcv = data.slice(0, 3);
        log.info('RPCRecv [' + msgTypeRPCRcv + '] ' + '[' + data + ']');
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

router.post('/request', async (req, res) => {
  try {
    let tvar = atob(req.body.message);
    log.info(tvar);
    if (tvar === 'eiei') res.json({ msg: 'Received!' });
    else res.json({ msg: 'Not Received!' });
  } catch (e) {
    if (e) log.error(e);
    res.json(errr.API_REQUEST_ERROR);
  }
});

module.exports = router;
