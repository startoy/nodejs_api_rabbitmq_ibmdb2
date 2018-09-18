'use strict';

import amqp from 'amqplib'
import * as cnf from './config'

const q = cnf.rpc_queue;

amqp.connect(cnf.amqp_uri)
  .then(conn => {
    return conn.createChannel();
  })
  .then(ch => {
    ch.assertQueue(q, { durable: false });
    ch.prefetch(1);
    console.log(" [x] Awaiting RPC Requests");
    ch.consume(q, msg => {
      
      const n = msg.content.toString();

      console.log(" [.] Receive[%s]", n);

      // start
      let tStart = Date.now();

      /* let r = fibonacci(n); */
      let r = "[FROM SERVER] RECEIVE:" + n

      // finish
      let tEnd = Date.now();

      // to send object as a message,
      // you have to call JSON.stringify
      r = JSON.stringify({
        result: r,
        time: (tEnd - tStart)
      });
      
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(r.toString()),
        { correlationId: msg.properties.correlationId });
      ch.ack(msg);
    })
  });