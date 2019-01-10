#!/bin/bash

VERSION=${1};

usage() {
        echo -e "---------------------------";
        echo -e " Usage: "$(basename ${0})" <version>";
        echo -e "  ex. <version> = 19.01.00.01"
        echo -e "---------------------------";
}

build() {
  echo 'Build with Version: ' $VERSION;
  echo 'Finding Dockerfile';
  ls -la $(pwd)/full

# TODO -> check if Dockerfile exist

  cp $(pwd)/full/Dockerfile $(pwd)/../
  ls -la $(pwd)/../

  cd $(pwd)/../
  docker build -t fwg/nodejs-api:$VERSION .

  cd -

  docker images
  docker ps -a
}

if [ -z "$VERSION" ]
then usage
else build
fi