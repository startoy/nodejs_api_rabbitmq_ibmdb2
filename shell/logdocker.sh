#!/usr/bin/bash

id=$(docker ps -a | grep fwg/api-rabbit | awk '{print $1}')
echo 'Get PID '$id
echo 'docker logs -f '$id
docker logs -f $id