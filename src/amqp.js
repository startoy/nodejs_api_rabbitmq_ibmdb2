'use strict'

import amqp from 'amqplib'
import EventEmitter from 'events'

async function connect(setting) {
  const conn = await amqp.connect(setting.uri);
  return conn;
}

async function channel(conn) {
  const channel = await conn.createChannel();
  /*   channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0); */
  return channel
}

async function genQueue(channel) {
  const q = await channel.assertQueue('', {
    exclusive: true
  });
  return q;
}

async function sendRPCMessage(channel, message, rpcQueue, q) {
  return new Promise(resolve => {
    const correlationId = generateUuid().toString();
    try {
      channel.consume(q.queue, msg => {
        if (msg.properties.correlationId == correlationId) {
          console.log('Should Resolve', resolve);
          resolve(msg);
        }
      }, {
        noAck: true
      });
    } catch (e) {
      console.error(e)
    }
    try {
      channel.sendToQueue(rpcQueue, new Buffer.from(message), {
        correlationId,
        replyTo: q.queue
      });
      console.log('Sent to Queue success');
    } catch (e) {
      console.error(e)
    }
  })
}

async function sendToQueue(channel, Queue, message) {
  await channel.assertQueue(Queue, {
    durable: false,
    autoDelete: true
  });
  channel.sendToQueue(Queue, new Buffer.from(message));
}

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

module.exports = {
  connect: connect,
  channel: channel,
  genQueue: genQueue,
  sendRPCMessage: sendRPCMessage,
  sendToQueue: sendToQueue
}