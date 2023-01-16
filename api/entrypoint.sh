#!/bin/bash

while ! nc -z rabbitmq 5672; do
  echo 'waiting for rabbitmq container...'
  sleep 1
done

while ! nc -z redis 6379; do
  echo 'waiting for redis container...'
  sleep 1
done

node server.js