/* 
  server.js


*/

export const env = process.env.NODE_ENV || 'development';

export const port = process.env.PORT || 8080;
export const hostname = process.env.HOSTNAME || '0.0.0.0';

export const log_filename = process.env.LOG_NAME || 'access.log';
export const amqp_uri = process.env.AMQP_URI || 'amqp://localhost';
export const reply_queue = process.env.REPLY_QUEUE || 'amq.rabbit.reply-to';
export const rpc_queue = process.env.RPC_QUEUE || 'amq.rabbit.rpc';