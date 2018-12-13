/**
 * Server for RPC test
 * @param {*} msg
 * @returns {*}
 */

'use strict';

const amqp = require('amqplib');
const util = require('./lib/util');

const q = 'test_queue';
amqp
  .connect('amqp://localhost')
  .then(conn => {
    return conn.createChannel();
  })
  .then(ch => {
    ch.assertQueue(q, {
      durable: false
    });
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC Requests [%s]', q);
    ch.consume(q, msg => {
      const n = msg.content.toString();
      console.log(' [.] Receive [%s]', n);

      // start
      // let tStart = Date.now();

      let r;

      if (util.isNumber(n)) r = fibonacci(n);
      else r = 'SERVER|STRING|' + n + '|';
      console.log(' [.] Create String' + r + ' Type:' + typeof r);
      r = 'RMU10170012 ,1,1,114632800,0,0,4,ABICO ,N, ,100,0.35,0.40,0.25,0.30,710,680,0,0,*,BANPU ,A, ,050,0.35,0.40,0.25,0.30,65000,1750,0,0,*,BLISS ,N, ,100,0.35,0.40,0.25,0.30,10000,4,0,0,*,CCP ,N,S,070,0.35,0.40,0.25,0.30,10000,36,0,0,*';
      // finish
      // let tEnd = Date.now();

      // to send object as a message,
      // you have to call JSON.stringify
      /* r = JSON.stringify({
        result: r,
        time: (tEnd - tStart)
      }); */
      console.log(
        ' [.] Send back to',
        msg.properties.replyTo,
        msg.properties.correlationId
      );
      ch.sendToQueue(msg.properties.replyTo, new Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId
      });
      console.log('Ack msg');
      ch.ack(msg);
    });
  })
  .catch(err => {
    console.log('Something went wrong ' + err);
  });

function fibonacci(n) {
  if (!n) n = 1;

  if (n === 0 || n === 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
