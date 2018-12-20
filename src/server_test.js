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

      if (Number.isInteger(n)) r = fibonacci(n);
      else r = 'SERVER|STRING|' + n + '|';
      console.log(' [.] Create String' + r + ' Type:' + typeof r);
      r =
        'RMU50030002  ,2,3,6265268000,0,0,12,BRC                 ,N, ,000,0.35,0.40,0.25,0.30,40000,0,0,0,*,BTS                 ,A,R,050,0.35,0.40,0.25,0.30,25000,885,0,0,*,CCP                 ,N,S,070,0.35,0.40,0.25,0.30,13000,36,0,0,*,CPF                 ,A, ,050,0.35,0.40,0.25,0.30,90000,2400,0,0,*,CPF                 ,A,E,050,0.35,0.40,0.25,0.30,25000,1700,0,0,*,CPF                 ,A,B,050,0.35,0.40,0.25,0.30,25000,2500,0,0,*,CPN                 ,A,R,050,0.35,0.40,0.25,0.30,25000,7575,0,0,*,DTAC                ,A,R,050,0.35,0.40,0.25,0.30,25000,2225,0,0,*,GLOW                ,A,R,050,0.35,0.40,0.25,0.30,25000,8325,0,0,*,ITD                 ,A,S,050,0.35,0.40,0.25,0.30,25000,276,0,0,*,ITD                 ,A,B,050,0.35,0.40,0.25,0.30,25000,276,0,0,*,KBANK               ,A,B,050,0.35,0.40,0.25,0.30,25000,15000,0,0,*';
      r = 'RUC1,10170012  ,Customer Test for Implement#2,3000000.00,4078060.00,0.00,1500000.00,0.00,0.00,0.00,0.00,0.00,0.00,1017001   ,3000000.00';
      r = 'RMT10170012  ,B,C,8,1017,Trader Test for ISV##,0,0,407806000,0,300000000';
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
