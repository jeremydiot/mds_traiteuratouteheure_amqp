#!/bin/bash

docker compose -f docker-compose.prod.yml down --volumes --rmi local
docker system prune --force
docker volume prune --force