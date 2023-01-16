import amqplib from 'amqplib/callback_api.js'
import { orderRepository } from "./order-repository.js"

const queue = 'orders'

amqplib.connect(`amqp://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'rabbitmq':'localhost'}:5672`,(err, conn)=>{
  if(err) throw err

  conn.createChannel((err, channel) =>{
    if(err) throw err
    channel.assertQueue(queue, {durable: true})
    channel.prefetch(1)
    channel.consume(queue, async (msg)=>{
      if(msg !== null){
        let order = await orderRepository.fetch(msg.content.toString())
        order.flag = 'commande traitée'
        let entityId = await orderRepository.save(order)
        channel.ack(msg)
      }else{
        console.log('Consumer cancelled by server')
      }
    })
  })
})
