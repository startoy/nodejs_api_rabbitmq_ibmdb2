/**
 * @name rpc
 * @description router :url/rpc/:requestString
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import client from '../lib/amqp';
import * as cnf from '../lib/config';
import { __processMsgRecv, __processMsgSend } from '../msgManager';
import { log, devlog, wait, jForm } from '../lib/util';

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
      devlog.error('router rpc got msg invalid format');
      return res.json(jForm('Invalid message format'));
    }
    const message = req.params.message;
    const queueName = req.params.queueName;
    devlog.info('Sending message[' + message + '] Queue[' + queueName + ']');
    devlog.info('Wait Time ' + cnf.replyWaitTime + ' ms');
    log.info('RPCSend [' + msgTypeRcv + '] ' + message);
    Promise.race([
      client.sendRPCMessage(channel, message, queueName),
      wait(cnf.replyWaitTime)
    ]).then(val => {
      devlog.info('Promise Race Done');
      if (val) {
        let data = val.toString();
        let msgTypeRPCRcv = data.slice(0, 3);
        log.info('RPCRecv [' + msgTypeRPCRcv + '] ' + data);
        let jsonData = __processMsgSend(data);
        res.json(jsonData);
        return;
      }
      res.json(jForm('response from server timeout'));
    });
  } catch (e) {
    if (e) log.error(e);
    res.json(jForm('error on calling api'));
  }
});

module.exports = router;
