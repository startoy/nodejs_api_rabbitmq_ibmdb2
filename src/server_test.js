'use strict';

const amqp = require('amqplib');
const util = require('./util');

const q = 'test_queue';
amqp.connect('amqp://localhost')
  .then(conn => {
    return conn.createChannel();
  })
  .then(ch => {
    ch.assertQueue(q, {
      durable: false
    });
    ch.prefetch(1);
    console.log(" [x] Awaiting RPC Requests");
    ch.consume(q)
      .then( msg => {
        const n = msg.content
        console.log(" [.] Receive [%s]", n);
        return n, msg.properties.correlationId;
      })
      .then( (msg, id) => {
        return fibonacci(msg), id;
      })
      .then( (result, id) => {
        ch.sendToQueue(msg.properties.replyTo,
          new Buffer.from(result), {
            correlationId: id
          });

        ch.ack(msg);
      })
    })

function fibonacci(n) {
  return new Promise( (resolve,reject) => {
    if (!n) n = 1;

    if (n === 0 || n === 1)
      return n;
    else
      return fibonacci(n - 1) + fibonacci(n - 2);
  })
}