/**
 * @name nodejs_api_rabbitmq
 * @description nodejs_api_rabbitmq
 * @author Peerapat Suksri
 * @version see /lib/config
 */

import express from 'express';
import logger from 'morgan';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import rfs from 'rotating-file-stream';

import { log, printf } from './lib/util';
import * as routerfn from './lib/routerFunction';
import { sv, log as lconsole, enableDB2 } from './lib/config';

import rpcRouter from './routes/rpc';
import directRouter from './routes/direct';
// import db2Router from './routes/db2';
if (enableDB2) var db2Router = require('./routes/db2');

var app = express();
var logFile = 'express.log';
var logDirectory = path.join(__dirname, '../logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = rfs(logFile, {
  interval: '1d', // daily rotate file
  path: logDirectory
});

logger.format(
  'FWGLogFormat',
  ':date[iso] : :method :url :status :response-time ms - :res[content-length]'
);

app.use(
  logger('FWGLogFormat', {
    stream: accessLogStream
  })
);

// Print Settings
log.info(printf(' [.] Enable IBM-DB2 [%s]', enableDB2));
log.info('Environment Setting:');
if (lconsole.dev) {
  log.info(' [.] Development');
  log.info(" [.] use logger('dev')");
  app.use(logger('dev'));
} else {
  log.info(' [.] Production');
}
log.info('Loading Log Setting:');
log.info(printf(' [.] Show Node log to screen [%s]', lconsole.node));
log.info(printf(' [.] Show Dev  log to screen [%s]', lconsole.dev));
log.info(printf(' [.] Show Data log to screen [%s]', lconsole.data));
log.info(printf(' [.] Show DB   log to screen [%s]', lconsole.db));
log.info(printf('Node API Version: %s', sv.version));

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(routerfn.setResHeader);

// Router Setup
app.all('/', routerfn.showIndex);
app.all('/version', routerfn.showVersion);
app.use('/rpc', rpcRouter);
app.use('/direct', directRouter);
if (enableDB2) app.use('/db', db2Router);

// catch 404 then redirect to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in dev
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
