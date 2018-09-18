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

const REPLY_TO = cnf.reply_to;

/**
 * Create amqp Channel and return back, return promise
 * @param {Object} params
 * @returns {Promise} - return amqp channel 
 */
const createClient = (setting) => amqp.connect(setting.url)
  .then(conn => conn.createChannel()) // create channel
  .then(channel => {
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    channel.consume(REPLY_TO,
      msg => channel.responseEmitter.emit(msg.properties.correlationId, msg.content), {
        noAck: true
      });
    return channel;
  });

  
/** return Promise obj when event emitt from consume function
 * @param {Object} channel - amqp channel
 * @param {String} message - message to send to consumer (which is Okury)
 * @param {String} rpcQueue - name of the queue where will be sent to
 * @returns {Promise} - return msg that send back from Okury
 */
const sendRPCMessage = (channel, message, rpcQueue) => new Promise(resolve => {
  // unique random string
  const correlationId = util.generateUuid();

  channel.responseEmitter.once(correlationId, resolve);
  channel.sendToQueue(rpcQueue, new Buffer(message), {
    correlationId,
    replyTo: REPLY_TO
  });
});



module.exports.createClient = createClient;
module.exports.sendRPCMessage = sendRPCMessage;