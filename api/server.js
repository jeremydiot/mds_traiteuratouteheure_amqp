import express from 'express'
import cors from 'cors'
import { orderRouter } from './order-router.js'

// express
const app = new express()
app.use(express.json())
app.use(cors())

app.use('/order',orderRouter)

app.get('/', (req,res)=>{
  res.send({
    message:"it works"
  })
})

app.listen(3000)