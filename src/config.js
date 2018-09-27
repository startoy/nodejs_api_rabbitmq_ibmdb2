/**
 * @name config.js
 * @description config when running node
 */

export const env = process.env.NODE_ENV || 'development';
export const dev = env === 'development' ? true:false;

// ACCESS
export const hostname = process.env.HOSTNAME || 'localhost'; // if Docker should use 0.0.0.0 ??
export const port = process.env.PORT || 8080;
export const amqp_uri = process.env.AMQP_URI || 'amqp://localhost';
export const log_fname = process.env.LOG_FNAME || 'access.log';

// QUEUE
export const reply_to = process.env.REPLY_TO || 'rabbit.reply-to';
export const rpc_queue = process.env.RPC_QUEUE || 'test_queue';
export const direct_queue = process.env.DIRECT_QUEUE || 'direct_queue'