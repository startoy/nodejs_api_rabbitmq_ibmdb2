/**
 * @name config.js
 * @description config when running node
 */

// PROCESS
export const sv = {
  service: 'Node-API-Rabbit',
  version: '19.01.DB.02',
  desc: '- Add API query all stock name',
  last_update: '07/01/2019'
};

// ENVIRONMENTS
export const env = process.env.NODE_ENV || 'development';
export const isDev = env === 'development' ? true : false || false;

// Server
// if RabbitMQ mount with docker use ip of docker container !
export const hostname = process.env.HOSTNAME || 'localhost';
export const port = process.env.PORT || '15673';
export const AMQPURI = process.env.AMQPURI || 'amqp://localhost';

// QUEUE
export const replyTo = process.env.replyTo || 'rabbit.reply-to';
export const rpcQueue = process.env.rpcQueue || 'test_queue';
export const directQueue = process.env.directQueue || 'directQueue';

// DATABASE
export const db2 = {
  codepage: process.env.CODEPAGE || '874',
  host: process.env.DBHOST || '10.22.19.13',
  port: process.env.DBPORT || '50001',
  name: process.env.DBNAME || 'fisdb_nt',
  table: process.env.DBTABLE || 'SECCALLFORCERATETAB',
  user: process.env.DBUSER || 'db2inst1',
  pwd: process.env.DBPWD || 'db2inst1'
};

process.env.DB2CODEPAGE = db2.codepage;

// UTIL
export const replyWaitTime = process.env.REPLYWAITTIME || 6000;
