#!/usr/bin/bash

API_CONTAINER_NAME='fwg/nodejs-api';

id=$(docker ps -a | grep $API_CONTAINER_NAME | awk '{print $1}')

echo 'Get PID '$id
echo 'truncate -s 0 /var/lib/docker/containers/'$id'/'$id'-json.log'
truncate -s 0 /var/lib/docker/containers/$id/$id-json.log