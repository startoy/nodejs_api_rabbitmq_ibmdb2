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
    console.log('\n [x] %s %s (NEXT)', req.method, req.url);
  }
  next()
});

router.get('/direct/:message', async (req, res) => {
  const message = req.params.message;
  const queue_name = cnf.rpc_queue

  client.sendQueueMessage(channel, message, queue_name)
  let msg_response = util.format('Send To Queue [%s] Message [%s]', queue_name, message)
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
  const queue_name = cnf.rpc_queue

  client.sendRPCMessage(channel, message, queue_name)
    .then(msg => {
      console.log("Promise Receive [%s]", msg)
      const result = msg.toString();
      let msg_response = util.format('Send To Queue [%s] Message [%s] Result [%s]', queue_name, message, result)
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

/**
 * TEST API
 * localhost:8080/rpc/test_queue/15/200
 */

router.get('/rpc/:queue_name/:message/:iterate', async (req, res) => {
  const message = req.params.message;
  const queue_name = req.params.queue_name;
  const iterate = req.params.iterate;

  var start = new Date().getTime();
  var count = 0;
  var completed = 0;
  var i = 0;

console.log('START TIME [%d]', start);
  for(i=0; i<iterate; i++) {
    client.sendRPCMessage(channel, message, queue_name)
      .then(msg => {
        count++;
        completed++;
        // let msg_response = util.format('q[%s] msg[%s] r[%s]', queue_name, message, count)
        // console.log(msg_response);
        onComplete();
      });
  }

  function onComplete() {
    if (completed < i)
      return;
    let stop = Date.now();
    console.log("**************** Summary ****************")
    console.log('START TIME [%d]', start);
    console.log('STOP  TIME [%d]', stop)
    console.log('DIFF  TIME [%d]millisec ~ [%d]sec', stop - start, (stop - start)/1000)
    console.log('Request Count [%d]', count)
    console.log("*****************************************")
    let jsonStr = JSON.stringify({
      start_time: start,
      stop_time: stop,
      diff_mlsec: stop - start,
      diff_sec: (stop - start)/1000,
      req_times: count
    })
    res.json(JSON.parse(jsonStr));
  }
});

router.get('/about', (req, res) => {
  res.send('About Page...')
})


export default router