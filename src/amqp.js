'use strict'

import amqp from 'amqplib'
import EventEmitter from 'events'

let Q;

async function connect(setting) {
  const conn = await amqp.connect(setting.uri);
  return conn;
}

/**
 * Create client then consume message with Q
 * When promise, emit the event name `correlationId` then trigger callback (which is define when `.on()` `.once()` )
 * @param {*} conn 
 */
async function create(conn) {
  try {
    const channel = await conn.createChannel();
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    Q = await channel.assertQueue('', { exclusive:true})
    console.log(' -- GENERATE PRIVATE QUEUE --')
    console.log(' ----->', Q.queue)

    channel.consume( Q.queue, msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), {
      noAck: true
      }
    );
    return channel
  } catch (e) {
    console.error(e)
  }
}

/**
 * When we will send the message to broker, We listening event call `correlationId`.
 * When event trigger we call resolve promise back to where this function called
 * @param {*} channel 
 * @param {*} message 
 * @param {*} rpcQueue 
 */
async function sendRPCMessage(channel, message, rpcQueue) {
  return new Promise(resolve => {
    let correlationId = generateUuid();
    try {
      channel.responseEmitter.once(correlationId, resolve);
      channel.sendToQueue(rpcQueue, new Buffer.from(message), {
        correlationId,
        replyTo: Q.queue
      });
      console.log('Sent to Queue success..');
    } catch (e) {
      console.error(e)
    }
  })
}
/**
 * Send Message to specific queue name
 * @param {*} channel 
 * @param {*} message 
 * @param {*} Queue 
 */
async function sendToQueue(channel, message, Queue) {
  await channel.assertQueue(Queue, {
    durable: false,
    autoDelete: true
  });
  channel.sendToQueue(Queue, new Buffer.from(message));
}

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString();
}

module.exports = {
  connect: connect,
  create: create,
  sendRPCMessage: sendRPCMessage,
  sendToQueue: sendToQueue
}