#!/usr/bin/bash

API_CONTAINER_NAME='fwg/nodejs-api';

id=$(docker ps | grep $API_CONTAINER_NAME | awk '{print $1}')

echo 'Get PID '$id
echo 'docker logs -f '$id

docker logs -f $id
#docker exec -it $id tail -f logs/messages/messages.log 