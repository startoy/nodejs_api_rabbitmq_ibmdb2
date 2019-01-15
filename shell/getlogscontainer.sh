#!/usr/bin/bash
echo -e '-----------------------------';
echo -e 'Get log file from both container and docker console';
API_CONTAINER_NAME='fwg/nodejs-api';

id=$(docker ps | grep $API_CONTAINER_NAME | awk '{print $1}')
echo 'Find '$API_CONTAINER_NAME
echo 'Get PID '$id
docker cp $id:app/logs/ .
echo 'Get logs/ from container completed'
echo -e '-----------------------------';
#ls -ld *logs/
du -msh logs/

cp /var/lib/docker/containers/$id*/$id*-json.log $id*-json.log 
echo 'Get json.log from docker console completed'
echo -e '-----------------------------';
du -msh $id*-json.log

echo -e '-----------------------------';