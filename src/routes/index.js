/**
 * @name router
 * @description router for handle api request
 * @todo use `express-winston` for logging middleware
 */

'use strict';

import express from 'express'
import '@babel/polyfill'
import util from 'util'

import client from '../amqp'
import * as cnf from '../config'
import * as utl from '../util'

const router = express.Router()
let channel;
let conn;

async function main() {
  try {
    conn = await client.connect({
      uri: cnf.amqp_uri
    })
    channel = await client.create(conn);
  } catch (e) {
    if (cnf.dev)
      console.error('ERROR WHEN CONNECT TO RABBITMQ BROKER', e);
    else
      console.log('ERROR WHEN CONNECT RABBITMQ BROKER')
  }
}

main();

// Logging Middleware
router.use((req, res, next) => {
  if (cnf.env === "development") {
    // console.log('\n [x] %s %s (NEXT)', req.method, req.url);
  }
  next()
});

router.get('/', async (req, res) => {
  res.json({
    message: 'THIS IS MESSAGE FROM ROUTER, YOU SHOULD SEE THIS MESSAGE'
  });
})

/**
 * TODO:
 */
router.get('/direct/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name;
  console.log('TODO!');
});

router.get('/rpc/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name;
  try {
    /* const q = await client.genQueue(channel) */
    const msg = await client.sendRPCMessage(channel, message, queue_name);
    res.json(msg.toString())
  } catch (e) {
    console.error(e)
  }
});

export default router