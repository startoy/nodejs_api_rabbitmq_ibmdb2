/**
 * CONFIG
 */

export const env = process.env.NODE_ENV || 'development';

// ACCESS
export const hostname = process.env.HOSTNAME || '0.0.0.0';
export const port = process.env.PORT || 8080;
export const amqp_uri = process.env.AMQP_URI || 'amqp://localhost';
export const log_filename = process.env.LOG_NAME || 'access.log';

// QUEUE
export const reply_to = process.env.REPLY_TO || 'rabbit.reply-to';
export const rpc_queue = process.env.RPC_QUEUE || 'test_queue';
export const direct_queue = process.env.DIRECT_QUEUE || 'direct_queue'