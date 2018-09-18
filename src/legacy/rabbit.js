import amqp from 'amqplib/callback_api'
import "@babel/polyfill";

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
  try {
    amqp.connect('amqp://localhost', (err, conn) => {
      let corr = randomid1().toString();
      let ch =  conn.createChannel()
      ch.assertQueue(cnf.reply_to); 

      console.log(' [x] Request Okury')

  // consume
       ch.consume(cnf.reply_to, msg => {
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Receive [%s]', msg.content.toString())
          ch.ack(msg)
          msg_reply = msg.content;
        }
      }, {noAck:false})

  // publish
       ch.sendToQueue(/* cnf.rpc_queue */ 'rpc_queue',
      new Buffer.from(/* msg_send */'10'),
      { correlationId: corr, replyTo: cnf.reply_to})
    })
  } catch {
    console.error('Error on chClient()')
  }
}