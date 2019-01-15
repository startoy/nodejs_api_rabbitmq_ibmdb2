/**
 * @name config.js
 * @description config when running node
 */

// DEPLOY SRC VERSION
export const sv = {
  service: 'fwg/nodejs-api',
  version: '19.01.DB.04',
  desc: '- add field avg_cost',
  last_update: '11/01/2019'
};

// ENVIRONMENTS
const env = process.env.NODE_ENV || 'development';
export const isDev = env === 'development' ? true : false || false;
const logCS = process.env.WRITEDATALOGCONSOLE || 'no';
export const logConsole = logCS === 'yes' ? true : false || false;
export const enableDB2 = process.env.ENABLEDB2 || true;
export const replyWaitTime = process.env.REPLYWAITTIME || 6000;

// Server
// if RabbitMQ mount with docker - use docker's container ip !
export const rbHostname = process.env.RBHOSTNAME || 'localhost';
export const rbPort = process.env.RBPORT || '15673';
export const AMQPURI = process.env.AMQPURI || 'amqp://localhost';

// QUEUE
// default self queue for replyback - currently use queue.random (auto gen by libraly)
export const selfQueue = process.env.SELFQUEUE || 'rabbit.reply-to';
// default target rpc queue
export const rpcQueue = process.env.RPCQUEUE || 'test_queue';
// default target direct queue
export const directQueue = process.env.DIRECTQUEUE || 'directQueue';

// DATABASE
export const db2 = {
  codepage: process.env.DBCODEPAGE || '874',
  host: process.env.DBHOST || '10.22.19.13',
  port: process.env.DBPORT || '50001',
  name: process.env.DBNAME || 'fisdb_nt',
  table: process.env.DBTABLE || 'SECCALLFORCERATETAB',
  user: process.env.DBUSER || 'db2inst1',
  pwd: process.env.DBPWD || 'db2inst1'
};

process.env.DB2CODEPAGE = db2.codepage;

// GLOBAL VARIABLES
global.pageSize = process.env.PAGESIZE || 20;
