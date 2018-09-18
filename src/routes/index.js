'use strict';
/* 
  server.js

*/


import express from 'express'
import '@babel/polyfill'
/* import client from '../customamqp' */
import client from '../amqp'
import * as cnf from '../config'

const router = express.Router()

let channel;
client.createClient({
    uri: cnf.amqp_uri
  })
  .then(ch => {
    channel = ch;
  })

// Logging middleware
router.use((req, res, next) => {
  console.log(' [x] %s %s (log from router..)', req.method, req.url);
  next()
});

router.get('/:message', async (req, res) => {
  const message = req.params.message;
  client.sendRPCMessage(channel, message, cnf.rpc_queue)
    .then(msg => {
      console.log("Client Receive [%s]", msg)
      const result = msg.toString();
      res.json(result);
    });
});

router.get('/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name
  client.sendRPCMessage(channel, message, queue_name)
    .then(msg => {
      console.log("Client Receive [%s]", msg)
      const result = msg.toString();
      res.json(result);
    });
});

router.get('/about', (req, res) => {
  res.send('About Page...')
})

export default router