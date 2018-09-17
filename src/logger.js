/* 
  logger.js




*/

import rfs from 'rotating-file-stream'
import fs from 'fs'
import path from 'path'
import cnf from './config'

const logDir = path.join(__dirname, 'log')

// check if log directory exists
fs.existsSync(logDir) || fs.mkdirSync(logDir)

// create a rotating write stream
const logger = rfs('access.log', {
  interval: '1d', // daily
  path: logDir
})


export default logger 
