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
  let fullURL = cnf.hostname+':'+cnf.port;
  if (err) {
    return console.log('Fail to intial server:', err);
  } else {
    console.log('Server is listening on \'%s\'', fullURL);
    console.log('Available API:')
    console.log('==>  /direct/:message')
    console.log('==>  /direct/:queue_name/:message')
    console.log('==>  /rpc/:message')
    console.log('==>  /rpc/:queue_name/:message')
  }
})
