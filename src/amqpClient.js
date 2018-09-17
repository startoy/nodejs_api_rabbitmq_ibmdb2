'use strict';

import amqp from "amqplib/callback_api"
import EvenEmitter from "events"
import * as cnf from './config'
import './util'
import { randomid1 } from "./util";

const REPLY_TO = cnf.reply_to;

/**
 * Create amqp Channel and return back as a promise
 * @param {Object} params
 * @returns {Promise} - return amqp channel 
 */
const createClient = (params) => amqp.connect(params.uri)
  .then(conn => conn.createChannel())
  .then(channel => {
    channel.responseEmmiter = new EvenEmitter()
    channel.responseEmmiter.setMaxListeners(0)
    channel.consume(REPLY_TO, msg => {
      channel.responseEmmiter.emit(msg.properties.correlationId, msg.content)
    }, {noAck: true})
    return channel
  })


/** return Promise obj when event emitt from consume function
 * @param {Object} channel - amqp channel
 * @param {String} message - message to send to consumer (which is Okury)
 * @param {String} rpcQueue - name of the queue where will be sent to
 * @returns {Promise} - return msg that send back from Okury
 */
const sendRPCMessage = (channel, message, rpcQueue)=> new Promise(
  resolve => {
    const corr = randomid1()
    
    channel.responseEmmiter.once(corr, resolve)
    channel.sendToQueue(rpcQueue, new Buffer.from(message), { corr, replyTo: REPLY_TO })

  }
)


module.exports.createClient = createClient
module.exports.sendRPCMessage = sendRPCMessage