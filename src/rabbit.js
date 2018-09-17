import amqp from 'amqplib/callback_api'

import { randomid1 } from './util'
import * as cnf from './config'

export async function initClient() {
  try {
  let conn = await amqp.connect('amqp://localhost')
  return conn
  } catch {
    console.error('Error on initClient()')
  }
}

export async function chClient(msg_send) {

var msg_reply;
await amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = randomid1().toString();

      console.log(' [x] Requesting fib(%d)', 10);

      ch.consume(q.queue, (msg)=>{
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Got %s', msg.content.toString());
	  msg_reply = msg.content.toString();
        }
      }, {noAck: true});

	if(msg_reply !== '')
	 { return "555555555" }

      ch.sendToQueue('rpc_queue',
      new Buffer('10'),
      { correlationId: corr, replyTo: q.queue });
    });
  });
});

/*
  //try {
    let conn = await amqp.connect('amqp://localhost')
    let corr = randomid1()
    let ch = await conn.createChannel()
    let q = await ch.assertQueue(cnf.reply_to); //self

    console.log(' [x] Request Okury')
    console.log(q.queue)

// consume
    await ch.consume(q.queue, msg => {
      if (msg.properties.correlationId == corr) {
        console.log(' [.] Receive [%s]', msg.conten.toString())
        ch.ack(msg)

      }
    }, {noAck:false})

// publish
    ch.sendToQueue(cnf.rpc_queue,
    new Buffer.from(msg_send.toString()),
    { correlationId: corr, replyTo: q.queue})
 // } catch {
  //  console.error('Error on chClient()')
 // }
*/
}
