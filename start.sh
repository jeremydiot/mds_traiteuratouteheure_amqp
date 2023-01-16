#!/bin/bash

./stop.sh

docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d --detach --force-recreate
docker system prune --force