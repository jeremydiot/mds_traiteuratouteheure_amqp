import { Entity, Schema, Client} from 'redis-om'

// create order database schema
class Order extends Entity {}
let schema = new Schema(Order,{
  flag: {type: 'string'},
  dish: {type: 'string'}
})

// get schema instruction to database
let client = await new Client().open(
  `redis://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'redis':'localhost'}:6379`
)
export let orderRepository = client.fetchRepository(schema)
await orderRepository.createIndex()