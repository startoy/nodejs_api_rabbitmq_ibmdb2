'use strict';
/* 
  server.js

*/


import express from 'express'
import '@babel/polyfill'
/* import client from '../customamqp' */
import client from '../amqp'
import * as cnf from '../config'
import util from 'util'
import * as utl from '../util'

const router = express.Router()
/* 
let conn;
client.connect({
    uri: cnf.amqp_uri
  })
  .then(c => {
    conn = c;
  })
 */
// Logging middleware
router.use((req, res, next) => {
  if (cnf.env === "development") {
    console.log('\n [x] %s %s (NEXT)', req.method, req.url);
  }
  next()
});


router.get('/direct/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name;
});


router.get('/rpc/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name
  try {
    const conn = await client.connect({
      uri: cnf.amqp_uri
    });
    const channel = await client.channel(conn);
    const q = await client.genQueue(channel)
    const msg = await client.sendRPCMessage(channel, message, queue_name, q);
    // console.log(msg.content.toString());
    conn.close();
    res.json(msg.content.toString())
  } catch(e) {
    console.error(e)
  }
});

export default router