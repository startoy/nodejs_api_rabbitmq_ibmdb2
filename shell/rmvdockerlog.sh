#!/usr/bin/bash

id=$(docker ps -a | grep fwg/api-rabbit | awk '{print $1}')
echo 'Get PID '$id
echo 'truncate -s 0 /var/lib/docker/containers/'$id'/'$id'-json.log'
truncate -s 0 /var/lib/docker/containers/$id/$id-json.log