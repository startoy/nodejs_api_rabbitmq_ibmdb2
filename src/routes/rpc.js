/**
 * @name rpc
 * @description router :url/rpc/:requestString
 */

'use strict';

import express from 'express';
import '@babel/polyfill';

import * as db from '../db/nodedb2';
import client from '../lib/amqp';
import * as cnf from '../lib/config';
import {
  __processMsgRecv,
  __processMsgSend,
  __processObjtoStr
} from '../msgManager';
import { log, devlog, wait } from '../lib/util';
import errr from '../error/type';

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
    log.info("Did RabbitMQ service's start ?");
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

router.post('/query', async (req, res) => {
  try {
    const msgType = req.body.msgType.slice(0, 3); // TypeError if not send field msgtype to this router
    const msgData = req.body;
    if (!__processMsgRecv(msgType, JSON.stringify(msgData))) {
      devlog.error('Error on __processMsgRecv');
      return res.json(errr.UNKNOWN_MESSAGE_TYPE);
    }

    // logic goes here...
    let dataString = __processObjtoStr(msgData);
    console.log('Router get ' + dataString);

    // promise race
    Promise.race([
      client.sendRPCMessage(channel, dataString, cnf.rpcQueue),
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

router.post('/querydb', async (req, res) => {
  try {
    let queryStmnt = 'SELECT * FROM SECCALLFORCERATETAB';
    let jsonArray = await db.query(queryStmnt);
    // logic goes here...
    // TODO:
    // convert to json object format
    let jsonObj = db.getJsonObj(jsonArray);
    log.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    if (e) log.error(e);
    res.json(errr.API_REQUEST_ERROR);
  }
});

router.post('/querystock', async (req, res) => {
  try {
    let queryStmnt = 'SELECT * FROM SECCALLFORCERATETAB';
    let jsonArray = await db.query(queryStmnt);
    // get stock from each array
    let dataArray = db.getValuefromKey(jsonArray, 'SECSYMBOL');
    // convert to json object format
    let jsonObj = db.getJsonObj(dataArray);
    log.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    if (e) log.error(e);
    res.json(errr.API_REQUEST_ERROR);
  }
});

/**
 * @deprecated
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

router.get('/querydb', async (req, res) => {
  try {
    let queryStmnt = 'SELECT * FROM SECCALLFORCERATETAB';
    let jsonArray = await db.query(queryStmnt);
    // logic goes here...
    // TODO:
    // convert to json object format
    let jsonObj = db.getJsonObj(jsonArray);
    log.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    if (e) log.error(e);
    res.json(errr.API_REQUEST_ERROR);
  }
});

router.get('/querystock', async (req, res) => {
  try {
    let queryStmnt = 'SELECT * FROM SECCALLFORCERATETAB';
    let jsonArray = await db.query(queryStmnt);
    // get stock from each array
    let dataArray = db.getValuefromKey(jsonArray, 'SECSYMBOL');
    // convert to json object format
    let jsonObj = db.getJsonObj(dataArray);
    log.info('SendDB2 [' + JSON.stringify(jsonObj) + ']');
    res.json(jsonObj);
  } catch (e) {
    if (e) log.error(e);
    res.json(errr.API_REQUEST_ERROR);
  }
});

module.exports = router;
