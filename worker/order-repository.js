import { Entity, Schema, Client} from 'redis-om'

// create order database schema
class Order extends Entity {}
const schema = new Schema(Order,{
  flag: {type: 'string'},
  dish: {type: 'string'}
})

// get schema instruction to database
const client = await new Client().open(
  `redis://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'redis':'localhost'}:6379`
)
export const orderRepository = client.fetchRepository(schema)
await orderRepository.createIndex()