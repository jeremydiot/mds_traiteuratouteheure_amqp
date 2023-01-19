import amqplib from 'amqplib/callback_api.js'
import { orderRepository } from "./order-repository.js"
const queueName = 'orders'

// exchange with amqp server
amqplib.connect(`amqp://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'rabbitmq':'localhost'}:5672`,(err, conn)=>{
  if(err) throw err

  // read 'orders' rabbitmq queue
  conn.createChannel((err, channel) =>{
    if(err) throw err
    channel.assertQueue(queueName, {durable: true})
    channel.prefetch(1)

    // attach function to queue
    channel.consume(queueName, async (msg)=>{
      if(msg !== null){

        // get order from database
        const res = JSON.parse(msg.content.toString())
        const order  = await orderRepository.fetch(res.entityId)
        
        if(res.message == 'créer plat'){
          console.log(`WORKER retrieve: ${res.entityId}`)
          // update flag
          order.flag = 'commande traitée'
          
          // save updated order to database
          await orderRepository.save(order)
          // valid message processing in queue
          channel.ack(msg)
        }

      }else{
        console.log('Consumer cancelled by server')
      }
    })
  })
})
