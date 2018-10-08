'use strict';
/* 
  server.js

*/

import express from 'express';
import '@babel/polyfill';
/* import client from '../customamqp' */
import client from '../amqp';
import * as cnf from '../config';

const router = express.Router();

let channel;
let conn;
async function main() {
  conn = await client.connect({
    uri: cnf.amqpUri
  });
  channel = await client.create(conn);
}
main();

/*  OR USE THIS TO DECLARE CHANNEL
client.connect({
  uri: cnf.amqpUri
}).then(conn => {
  client.channel(conn)
  .then( ch=>{ channel = ch })
}) */

// Logging middleware
router.use((req, res, next) => {
  if (cnf.env === 'development') {
    console.log('\n [x] %s %s (NEXT)', req.method, req.url);
  }
  next();
});

router.get('/direct/:queueName/:message', async (req, res) => {
  /* const message = req.params.message;
  const queueName = req.params.queueName; */
});

router.get('/rpc/:queueName/:message', async (req, res) => {
  const message = req.params.message;
  const queueName = req.params.queueName;
  try {
    /* const q = await client.genQueue(channel) */
    const msg = await client.sendRPCMessage(channel, message, queueName);
    res.json(msg.toString());
  } catch (e) {
    console.error(e);
  }
});

export default router;
