import path from 'path'
import fs from 'fs'
import express from 'express'

import * as cnf from '../config'


const router = express.Router()

// Logging middleware
router.use((req, res, next) => {
  console.log(' [x] %s %s', req.method, req.url);
  next()
});

router.get('/', (req, res) => {
  res.send('Home Page...')
});

router.get('/about', (req, res) => {
  res.send('About Page...')
})

export default router