/* 
  server.js


*/

import express from 'express'
import * as cnf from '../config'


const router = express.Router()


// Logging middleware
router.use((req, res, next) => {
  console.log(' [x] %s %s (log from router..)', req.method, req.url);
  next()
});

router.get('/', (req, res) => {


/*
// NOT THE BEST PRACTICE TO REPEAT OPEN CONNECTION EVERYTIME CALL THIS API

  const connection = await amqp.connect(cnf.amqp_uri)
  try{
    const channel = await connection.createChannel();
    const exchange = 'EXCHANGE01'
    const message: Message = { hello: 'world' }
    const buffer = Buffer.from(JSON.stringify(message))

    await channel.assertExchange(exchange, 'topic', {durable : false})
    await channel.publish(exchange, 'routing.key', buffer, {
      contentType: 'application/json',
    })
    await channel.close()
  }
  finally{
    await connection.close();
  }
*/
  res.send(' [.] Receive [%s]', result.toString())
});

router.get('/about', (req, res) => {
  res.send('About Page...')
})

export default router