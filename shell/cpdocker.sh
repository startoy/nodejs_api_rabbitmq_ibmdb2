#!/usr/bin/bash

id=$(docker ps -a | grep fwg/api-rabbit | awk '{print $1}')
echo 'Get PID '$id
docker cp src/ $id:app/
echo 'Copy src/ to app/ '

echo 'Restarting Container...'
docker restart $id
