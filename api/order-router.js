import { Router } from "express"
import { orderRepository } from "./order-repository.js"
import amqplib from "amqplib/callback_api.js"
const queue = 'orders'

export let orderRouter  = Router()

orderRouter.post('/', async (req,res)=>{
  let order = orderRepository.createEntity()

  order.flag = 'commande en cours de traitement'
  order.dish = req.body.dish ?? null

  let entityId = await orderRepository.save(order)

  res.type('application/json')
  res.send({entityId})

  amqplib.connect(`amqp://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'rabbitmq':'localhost'}:5672`,(err, conn)=>{
    if(err) throw err
    
    conn.createChannel((err, channel) =>{
      if(err) throw err
      channel.assertQueue(queue, {durable: true})
      channel.sendToQueue(queue, Buffer.from(entityId), {persistent: true})
    })

  })
})

orderRouter.get('/:id', async (req, res)=>{
  let order = await orderRepository.fetch(req.params.id)

  res.type('application/json')
  res.send(order)
})