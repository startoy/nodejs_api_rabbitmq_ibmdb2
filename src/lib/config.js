/**
 * @name config.js
 * @description config when running node
 */

// DEPLOY SRC VERSION
export const sv = {
  service: 'fwg/nodejs-api',
  version: '19.01.DB.05',
  desc: '- Support filter secsymbol in db/querydb/',
  last_update: '17/01/2019'
};

// ENVIRONMENTS
let rEnv = process.env.NODE_ENV || 'development';
const devLogConsole = rEnv === 'development' ? true : false || false;

let rdata = process.env.WRITEDATALOGCONSOLE || 'no';
const dataLogConsole = rdata === 'yes' ? true : false || false;

let rDB = process.env.WRITEDBLOGCONSOLE || 'yes';
const dbLogConsole = rDB === 'yes' ? true : false || false;

let rNode = process.env.WRITENODELOGCONSOLE || 'yes';
const nodeLogConsole = rNode === 'yes' ? true : false || false;

let rErr = process.env.WRITEERRORLOGCONSOLE || 'yes';
const errorLogConsole = rErr === 'yes' ? true : false || false;

export const log = {
  dev: devLogConsole,
  data: dataLogConsole,
  db: dbLogConsole,
  node: nodeLogConsole,
  err: errorLogConsole
};

let rcvEnableDB2 = process.env.ENABLEDB2 || 'yes';
export const enableDB2 = rcvEnableDB2 === 'yes' ? true : false || false;
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
