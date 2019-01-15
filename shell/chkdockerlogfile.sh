#!/usr/bin/bash
echo -e '-----------------------------';
API_CONTAINER_NAME='fwg/nodejs-api';

id=$(docker ps | grep $API_CONTAINER_NAME | awk '{print $1}')

echo '-> Get PID '$id
ls -l /var/lib/docker/containers/$id*/$id*-json.log
echo '-> File size..'
du -msh /var/lib/docker/containers/$id*/$id*-json.log
echo -e '-----------------------------';