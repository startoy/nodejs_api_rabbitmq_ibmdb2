/**
 * @name logger.js
 * @description TODO: Create Log System for the god's sake
 *
 */

import rfs from 'rotating-file-stream';
import fs from 'fs';
import path from 'path';
import * as cnf from './config';

const logDir = path.join(__dirname, 'log');
const logFName = cnf.logFileName;

// check if log directory exists
fs.existsSync(logDir) || fs.mkdirSync(logDir);

// create a rotating write stream
const logger = rfs(logFName, {
  interval: '1d', // daily
  path: logDir
});

export default logger;
