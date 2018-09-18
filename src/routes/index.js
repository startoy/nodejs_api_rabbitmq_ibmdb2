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
  if (cnf.env === "development") {
    console.log(' [x] %s %s (LOG ROUTER..)', req.method, req.url);
  }
  next()
});

router.get('/direct/:message', async (req, res) => {
  const message = req.params.message;
  client.sendQueueMessage(channel, message, cnf.rpc_queue)
  let msg_response = util.format('Send To Queue [%s] Message [%s]', cnf.rpc_queue, message)
  res.json(msg_response);
});

router.get('/direct/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name;
  client.sendQueueMessage(channel, message, queue_name)
  let msg_response = util.format('Send To Queue [%s] Message [%s]', queue_name, message)
  res.json(msg_response);
});

router.get('/rpc/:message', async (req, res) => {
  const message = req.params.message;
  client.sendRPCMessage(channel, message, cnf.rpc_queue)
    .then(msg => {
      console.log("Promise Receive [%s]", msg)
      const result = msg.toString();
      let msg_response = util.format('Send To Queue [%s] Message [%s] Result [%s]', cnf.rpc_queue, message, result)
      res.json(msg_response);
    });
});

router.get('/rpc/:queue_name/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name
  client.sendRPCMessage(channel, message, queue_name)
    .then(msg => {
      console.log("Promise Receive [%s]", msg)
      const result = msg.toString();
      let msg_response = util.format('Send To Queue [%s] Message [%s] Result [%s]', queue_name, message, result)
      res.json(msg_response);
    });
});

router.get('/about', (req, res) => {
  res.send('About Page...')
})

export default router