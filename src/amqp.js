'use strict'

/**
 * For now, can't use `async/await` way
 * use Promise (.then) instead
 * TODO: make use of `async/await`
 */

import amqp from 'amqplib'
import EventEmitter from 'events'

import * as cnf from './config'
import * as util from './util'

// const REPLY_TO = cnf.reply_to;
var THIS_QUEUE;

/**
 * Create amqp Channel and return back the promise
 * 
 * @param {Object} params
 * @returns {Promise} - return amqp channel 
 */
const createClient = (setting) => amqp.connect(setting.uri)
  .then(conn => conn.createChannel()) // create channel
  .then(channel => {
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    channel.assertQueue('', {
        exclusive: true
      })
      .then(q_name => {
        THIS_QUEUE = q_name.queue
        console.log('\n ==== GENERATE PRIVATE QUEUE ====')
        for (let prop in q_name) {
          console.log(' =  Key[.%s][%s]', prop, q_name[prop])
        }
        console.log(' ================================ \n')
      })

    // emit (event, [arg1], [arg2], [...]) 
    // Make an event listener for an event called "msg.properties.correlationId", then provoke the event
    channel.consume(
      THIS_QUEUE,
      msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), {
        noAck: true
      }
    );
    return channel;
  });

/** 
 * return Promise obj when event emit from consume function
 * 
 * @param {Object} channel - amqp channel
 * @param {String} message - message to send to consumer (which is Okury)
 * @param {String} rpcQueue - name of the queue where will be sent to
 * @returns {Promise} - return msg that send back from Okury
 */
const sendRPCMessage = (channel, message, rpcQueue) => new Promise(resolve => {
  // unique random string
  const correlationId = util.generateUuid();

  // once (event, listener) Register a single listener for the specified event
  // Invoked only once
  channel.responseEmitter.once(correlationId, resolve);

  /* channel.assertQueue(rpcQueue, {durable: false}); */
  channel.sendToQueue(rpcQueue, new Buffer.from(message), {
    correlationId,
    replyTo: THIS_QUEUE
  });
});

/**
 * just send msg to queue and end process
 * 
 * @param {Object} channel 
 * @param {String} message 
 * @param {String} Queue 
 */
const sendQueueMessage = (channel, message, Queue) => {
  channel.assertQueue(Queue, {
    durable: false,
    autoDelete: true
  });
  channel.sendToQueue(Queue, new Buffer.from(message));
};

module.exports = {
  createClient: createClient,
  sendRPCMessage: sendRPCMessage,
  sendQueueMessage: sendQueueMessage,
}