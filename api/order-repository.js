import { Entity, Schema, Client} from 'redis-om'

class Order extends Entity {}
let schema = new Schema(Order,{
  flag: {type: 'string'},
  dish: {type: 'string'}
})

let client = await new Client().open(
  `redis://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'redis':'localhost'}:6379`
)
export let orderRepository = client.fetchRepository(schema)
await orderRepository.createIndex()