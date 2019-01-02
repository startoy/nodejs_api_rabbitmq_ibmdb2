#!/usr/bin/bash

id=docker ps -a | grep fwg/api-rabbit | awk '{print $1}'
docker cp src/ $id:app/src