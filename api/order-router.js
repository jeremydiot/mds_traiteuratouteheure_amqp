import { Router } from "express"
import { orderRepository } from "./order-repository.js"
import amqplib from "amqplib/callback_api.js"
const queue = 'orders'

export const orderRouter  = Router()

// create order route
orderRouter.post('/', async (req,res)=>{

  // create order database object
  const order = orderRepository.createEntity()
  order.flag = 'commande en cours de traitement'
  order.dish = req.body.dish ?? null

  // save order in database and get id
  const entityId = await orderRepository.save(order)

  // send new id in response
  res.type('application/json')
  res.send({entityId})

  // exchange with amqp server
  amqplib.connect(`amqp://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'rabbitmq':'localhost'}:5672`,(err, conn)=>{
    if(err) throw err
    
    // get new database order id to 'orders' queue
    conn.createChannel((err, channel) =>{
      if(err) throw err
      channel.assertQueue(queue, {durable: true})
      
      // create new message in queue
      channel.sendToQueue(queue, Buffer.from(entityId), {persistent: true})
    })

  })
})

// get order route
orderRouter.get('/:id', async (req, res)=>{

  // get order from database
  const order = await orderRepository.fetch(req.params.id)

  // send database object content in response
  res.type('application/json')
  res.send(order)
})