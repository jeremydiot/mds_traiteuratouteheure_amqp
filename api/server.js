import express from 'express'
import cors from 'cors'
import { orderRouter } from './order-router.js'

// configure http server
const app = new express()
app.use(express.json())
app.use(cors())

// redirect /order route to router
app.use('/order',orderRouter)

// route for sanity test
app.get('/', (req,res)=>{
  res.send({
    message:"it works"
  })
})

// start server on port 3000
app.listen(3000)