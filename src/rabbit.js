import amqp from 'amqplib/callback_api'
import * as cnf from './config'

export async function initClient(){
  let conn = await amqp.connect(cnf.uri)
  return conn
}