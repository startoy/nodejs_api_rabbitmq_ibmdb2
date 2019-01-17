#!/bin/bash

VERSION=${1};

usage() {
        echo -e "---------------------------";
        echo -e " Usage: "$(basename ${0})" <version>";
        echo -e "  ex. <version> = 19.01.DB.01"
        echo -e "---------------------------";
}

export_docker_image() {
  echo -e "export docker image.."
  docker save -o nodejs-api$VERSION.tar fwg/nodejs-api$VERSION

  echo -e "export processing completed.."
  ls -la
}

build() {
  local VERSION=':'$VERSION
  echo 'Build with Version: ['$VERSION']';
  echo 'Finding Dockerfile '$(pwd)/full;
  ls -la $(pwd)/full

# TODO -> check if Dockerfile exist

  cp $(pwd)/full/Dockerfile $(pwd)/../
  ls -la $(pwd)/../

  cd $(pwd)/../
  docker build -t fwg/nodejs-api$VERSION .

  cd -

  docker images
  docker ps -a
}

if [ -z "$VERSION" ]
then
usage
else 
build
export_docker_image
fi