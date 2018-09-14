

import express from 'express'
import morgan from 'morgan'

import loggerFile from './logger'
import routes from './routes'

const port = process.env.PORT || 8080
const hostname = process.env.HOST || '0.0.0.0'
const app = express()


app.use(morgan('tiny'))
app.use(morgan('dev', {
  skip: (req, res) => {
    return res.statusCode < 400
  }
}))
app.use(morgan('combined', {
  stream: loggerFile
}))

app.use(routes)

console.log("Starting server...")

app.listen(port, hostname, (err) => {
  if (err) {
    return console.log('Fail to intial server:', err);
  } else {
    console.log('Server is listening on port %d', port);
  }
})