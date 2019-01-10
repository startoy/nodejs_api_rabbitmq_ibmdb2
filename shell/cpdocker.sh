#!/usr/bin/bash

API_CONTAINER_NAME='fwg/nodejs-api';

id=$(docker ps -a | grep $API_CONTAINER_NAME | awk '{print $1}')

echo 'Get PID '$id
docker cp src/ $id:app/
echo 'Copy src/ to app/ '

echo 'Restarting Container...'
docker restart $id
