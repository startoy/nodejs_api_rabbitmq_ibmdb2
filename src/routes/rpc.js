/**
 * @name rpc
 * @description router :url/rpc/:requestString
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import client from '../lib/amqp';
import * as cnf from '../lib/config';
import { log, devlog, wait } from '../lib/util';

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
    title: 'THIS IS MESSAGE FROM ROUTER, YOU SHOULD SEE THIS MESSAGE'
  });
});

router.get('/:queueName/:message', async (req, res) => {
  const message = req.params.message;
  const queueName = req.params.queueName;
  devlog.info('get message: ' + message);
  devlog.info('call queue: ' + queueName);
  try {
    devlog.info(
      'Try sending message[' + message + '] Queue[' + queueName + ']'
    );
    /* const q = await client.genQueue(channel) */
    /* const msg = await client.sendRPCMessage(channel, message, queueName); */
    devlog.info('Wait Time ' + cnf.replyWaitTime + ' ms');
    Promise.race([
      client.sendRPCMessage(channel, message, queueName),
      wait(cnf.replyWaitTime)
    ]).then(val => {
      devlog.info('PromiseRace Done');
      if (val) {
        let data = val.toString();
        devlog.info('Got Data: ' + data);
        res.json({ message: data });
      } else {
        devlog.info('No return value');
        res.json({ message: 'no return value' });
      }
    });
  } catch (e) {
    if (e) log.error(e);
    res.json({ message: 'error on calling api' });
  }
});

module.exports = router;
