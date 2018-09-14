# Nodejs to Rabbitmq

  Provided RESTful-api to request data through Rabbitmq Server

# 1. Run on Node

## Prerequisites

  - Nodejs >= 8.9.4(test on Windows), 8.11.3(test on Ubuntu16)
  - Source code compressed file
  * Use `node-api-rabbitmq.zip` if server access the internet normally.
  * Use `node-api-rabbitmq_w_modules.zip` if server offlines or can not access the internet. 

## Setup

  Install dependencies (where `package.json` located)

  ```sh
    npm install
  ```

## Command 

  - build: transpiles using Babel `./src` to `./app`

      ```sh
        npm run build
      ```

  - serve: run the main application in ./app (which is server.js)
  
      ```sh
        npm run serve
      ```

  - start: `build` + `serve`
  
      ```sh
        npm start
      ```

  - test: test if files in ./src can transpile with Babel using `Mocha` 
  
      ```sh
        npm test
      ```

# 2. Run on Docker

  If run this node api through docker image

## Prerequisites

  - `Docker` version >= 17.03.2-ce, build f5ec1e2 (test on Ubuntu14)
    * if Centos7 should install using binary (test Docker version 18.03.0-ce, build 0520e24)

## Run from docker image

  - after load image(.tar) to docker, run follow command below.\
    this will map the current directory to inside image directory.\
  
  ```sh
    mkdir app
    cd app
  ```

  - then execute

  ```sh
    FIXME:
    docker run \
      -d \
      --name container_name \
      -v "$(pwd)":/app \
      -w /app \
      -p 3000:3000 \
      repo:tag \
      npm start
  ```

# 3. Build from source to Docker image

  this will build Docker image from source code.
  
## Require

  - Docker image `Node` which `repo:tag` should be >= `node:10.10.0-alpine`
      
      ```sh
        docker pull node:10.10.0-alpine
        docker run -d --name node-dev5 -p 8080:8080 docker-node:dev npm start 
      ```

  - Source code compressed file
    * Use `node-api-rabbitmq.zip` if server access the internet normally.
    * Use `node-api-rabbitmq_w_modules.zip` if server offlines or can not access the internet. 
  - *MUST* Internet access !!

## Step
  TODO:
  Assume you have a project .zip file `node-api-rabbitmq.zip` and folder `/node-api-rabbitmq` in it.

  1. Extract .zip file and cd to `node-api-rabbitmq/`

      ```sh
        // if using zip
        unzip -xvzf node-api-rabbitmq.zip

        // if using tar
        tar -xvzf node-api-rabbitmq.tar.gz

        cd node-api-rabbitmq/
      ```
  2. Build the image using `Dockerfile`

      ```sh
        docker build -t fwg/api-rabbit .
      ```
        * `-t` provide repository:tag
        * `.` path where `Dockerfile` exist

      Check if image exist

      ```sh
        docker images
          REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
          fwg-api-rabbit            test                da6d92132463        7 minutes ago       69.9 MB
      ```

  6. Export the images from docker to .tar file

      ```sh
        docker save -o apiRabbit.tar fwg-api-rabbit
      ```
      - `apiRabbit.tar` name the path to image tar file (MUST PROVIDE .tar to it)
      - `fwg-api-rabbit` name of image or repository on docker

  7. Import image tar file to server that have Docker as you wish then execute

      ```sh
        docker load -i apiRabbit.tar
      ```
      - where `<path to image tar file>` is path to image tar file

  8. Run container to serve service

      ```sh
        docker run -d --name node-api-rabbit -p 8080:8080 node-api-rabbitmq:18.03.00.01
      ```
      `-d` run background
      `--name` custom name


      docker run -d --name _name -v "$(pwd)":/app \
-w /app -p 4000:3000 name:tag node server.js

  TODO: make shell script to custom port (map port from container to outside by conig env)
