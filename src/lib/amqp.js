/**
 * @name amqp.js
 * @description amqp lib with reuse + emit event-driven, emit is faster than channel.cancel(consumerTag)
 *
 */
'use strict';

import amqp from 'amqplib';
import EventEmitter from 'events';

import { log, devlog } from './util';

let Q;

async function connect(setting) {
  log.info('Connecting to AMQP...');
  const conn = await amqp.connect(setting.uri);
  return conn;
}

/**
 * Create client then consume message with Q
 * When promise, emit the event name `correlationId` then trigger callback (which is define when `.on()` `.once()` )
 * @param {*} conn
 */
async function create(conn) {
  log.info('Creating channel...');
  try {
    const channel = await conn.createChannel();
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    Q = await channel.assertQueue('', { exclusive: true });
    devlog.info(' -- GENERATE PRIVATE QUEUE --');
    devlog.info(' ----->', Q.queue);

    channel.consume(
      Q.queue,
      msg =>
        channel.responseEmitter.emit(msg.properties.correlationId, msg.content),
      {
        noAck: true
      }
    );
    log.info('Channel Created !');
    return channel;
  } catch (e) {
    if (e) log.error(e);
    log.info('Creating channel failed: Termiated process..');
    process.exit(1);
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
  devlog.info('Calling sendRPCMessage');
  return new Promise(resolve => {
    let correlationId = generateUuid();
    try {
      channel.responseEmitter.once(correlationId, resolve);
      channel.sendToQueue(rpcQueue, new Buffer.from(message), {
        correlationId,
        replyTo: Q.queue
      });
      devlog.info('Call sendRPCMessage Succeed...');
    } catch (e) {
      if (e) log.error(e);
      devlog.info('Call sendRPCMessage Failed...');
    }
  });
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
  return Math.random().toString() + Math.random().toString();
}

module.exports = {
  connect: connect,
  create: create,
  sendRPCMessage: sendRPCMessage,
  sendToQueue: sendToQueue
};
