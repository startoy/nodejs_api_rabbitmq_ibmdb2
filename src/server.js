/* 
  server.js


*/

import express from 'express'
import morgan from 'morgan'

import logger from './logger'
import routes from './routes'
import * as cnf from './config'

const app = express()

if (cnf.env == 'development') {
  app.use(morgan('dev', {
    skip: (req, res) => {
      return res.statusCode < 400
    }
  }))
}
app.use(morgan('tiny'))
app.use(morgan('combined', {
  stream: logger
}))

app.use(routes)

console.log("Starting server...")

app.listen(cnf.port, cnf.hostname, (err) => {
  if (err) {
    return console.log('Fail to intial server:', err);
  } else {
    console.log('Server is listening on port %d', cnf.port);
    console.log('Available API:')
    console.log('send message to config queue => /:message')
    console.log('send message to queue => /:queue_name/:message')
  }
})
