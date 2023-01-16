# Traiteur à toute heure AMQP

## Requirements

- Node.js 16 and npm
- Docker
- docker compose plugin
- ports 3000 (api), 6379 (redis), 5672 and 15672 (rabbitmq) are free

## Commands


### Production

```bash
# from project root folder
./start.sh # for start
./stop.sh # for stop

# stop worker
docker stop traiteuratouteheureamqp_worker

# start worker
docker start traiteuratouteheureamqp_worker
```

> Rabitmq interface is located at <http://localhost:15672/#/queues>

### Developpment

```bash
# from project root folder
## start redis and rabbitmq
docker compose up -d
## stop redis and rabbitmq
docker compose down

## start api
cd api/
npm run start

## start worker
cd worker/
npm run start
```

> Rabitmq interface is located at <http://localhost:15672/#/queues>

## Docs

postman collection : [docs/postman_collection.json](docs/postman_collection.json)  
architecture schema : [docs/architecture.png](docs/architecture.png)  

### API routes

#### Create order

- POST localhost:3000/order   

>*body*   

```json
{
    "entityId": "string"
}
```

#### Get order

- GET localhost:3000/order/{entityId}

>*response*   

```json
{
    "entityId": "string",
    "flag": "string",
    "dish": "string"
}
```


### Development

- <https://developer.redis.com/develop/node/redis-om/>
- <https://registry.hub.docker.com/_/rabbitmq/>
- <https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html>
