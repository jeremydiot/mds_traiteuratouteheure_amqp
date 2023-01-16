import amqplib from 'amqplib/callback_api.js'
import { orderRepository } from "./order-repository.js"
const queue = 'orders'

// exchange with amqp server
amqplib.connect(`amqp://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'rabbitmq':'localhost'}:5672`,(err, conn)=>{
  if(err) throw err

  // read 'orders' rabbitmq queue
  conn.createChannel((err, channel) =>{
    if(err) throw err
    channel.assertQueue(queue, {durable: true})
    channel.prefetch(1)

    // attach function to queue
    channel.consume(queue, async (msg)=>{
      if(msg !== null){

        // get order from database
        let order = await orderRepository.fetch(msg.content.toString())

        // update flag
        order.flag = 'commande traitée'

        // save updated order to database
        await orderRepository.save(order)

        // valid message processing in queue
        channel.ack(msg)
      }else{
        console.log('Consumer cancelled by server')
      }
    })
  })
})
