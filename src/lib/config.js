/**
 * @name config.js
 * @description config when running node
 */

// PROCESS
export const version = '18.04.00.03';

// ENVIRONMENTS
export const env = process.env.NODE_ENV || 'development';
export const isDev = env === 'development' ? true : false || false;

// Server
// if RabbitMQ mount with docker use ip of docker container !
export const hostname = process.env.HOSTNAME || 'localhost';
export const port = process.env.PORT || 3000;
export const AMQPURI = process.env.AMQPURI || 'amqp://localhost';

// QUEUE
export const replyTo = process.env.replyTo || 'rabbit.reply-to';
export const rpcQueue = process.env.rpcQueue || 'test_queue';
export const directQueue = process.env.directQueue || 'directQueue';

// UTIL
export const replyWaitTime = process.env.REPLYWAITTIME || 6000;
