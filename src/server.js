/**
 * @name server
 * @description Main entry app
 * @author peerapat_suk
 * @version 18.03.01.01
 * @todo use body-parser if change router to use `POST`
 */

import express from 'express'
import morgan from 'morgan'

import logger from './logger'
import routes from './routes'
import * as cnf from './config'

const app = express()

{ /* morgan for log request */
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
}

app.use(routes)

console.log("Starting server...")

app.listen(cnf.port, cnf.hostname, (err) => {
  let fullURL = cnf.hostname+':'+cnf.port;
  if (err) {
    return console.log('Fail to initial server:', err);
  } else {
    console.log('Server is listening on \'%s\'', fullURL);
    console.log('Available API:')
    console.log('==>  /');
    console.log('==>  /direct/:queue_name/:message [untest]')
    console.log('==>  /rpc/:queue_name/:message')
  }
})
