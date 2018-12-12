/**
 * @name direct
 * @description router :url/direct/:requestString
 */

'use strict';

// Module
import express from 'express';
import '@babel/polyfill';

// Custom Lib
import { log } from '../lib/util';

const router = express.Router();

router.get('/', async (req, res, next) => {
  log.warn('TODO!');
  res.render('index', {
    title: 'THIS IS MESSAGE FROM ROUTER, YOU SHOULD SEE THIS MESSAGE'
  });
});

router.get('/:queue_name/:message', async (req, res) => {
  log.warn('TODO!');
  res.render('index', { title: 'Nodejs API Rabbitmq' });
});

module.exports = router;
