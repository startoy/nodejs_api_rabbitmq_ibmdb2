'use strict';
/* 
  server.js

*/


import express from 'express'
import '@babel/polyfill'
/* import client from '../customamqp' */
import client from '../amqp'

const router = express.Router()

let channel;
client.createClient({ uri: 'amqp://localhost' })
  .then(ch => {
    channel = ch;
  })

// Logging middleware
router.use((req, res, next) => {
  console.log(' [x] %s %s (log from router..)', req.method, req.url);
  next()
});

router.get('/:msg', async (req, res) => {
  const msg = req.params.msg;
  client.sendRPCMessage(channel, msg, 'rpc_queue')
    .then(msg => {
      res.send(' [+] Receive [%s]', msg)
    })
})

router.get('/about', (req, res) => {
  res.send('About Page...')
})

export default router
