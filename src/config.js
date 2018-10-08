/**
 * @name config.js
 * @description config when running node
 */

export const env = process.env.NODE_ENV || 'development';
export const dev = env === 'development' ? true:false;

// Server
// if RabbitMQ mount with docker use ip of docker container
export const hostname = process.env.HOSTNAME || 'localhost';
export const port = process.env.PORT || 8080;
export const amqpUri = process.env.amqpUri || 'amqp://localhost';
export const logFileName = process.env.LOG_NAME || 'access.log';

// QUEUE
export const replyTo = process.env.replyTo || 'rabbit.reply-to';
export const rpcQueue = process.env.rpcQueue || 'test_queue';
export const directQueue = process.env.directQueue || 'directQueue';
