# Nodejs to Rabbitmq

  Provided RESTful-api to request data through Rabbitmq Server

# 1. Run on Node

## Prerequisites

  - Nodejs >= 8.9.4(test on Windows), 8.11.3(test on Ubuntu16)

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

## How to build to docker image

  this will build Docker image from source code.
  
### Require

  - Docker image `Node` which `repo:tag` should be >= `node:10.10.0-alpine`
      
      ```sh
        docker
      ```

  - Source code compressed file
    * Use `rabbit-api-node.zip` if server access the internet normally.
    * Use `rabbit-api-node_w_modules.zip` if server offlines or can not access the internet. 

### Step
  TODO:
  Assume you have a project .zip file `rabbit-api-node.zip` and folder `/app` in it.

  1. extract .zip file and cd to `app/`

      ```sh
        // if using zip
        unzip -xvzf rabbit-api-node.zip

        // if using tar
        tar -xvzf rabbit-api-node.tar.gz

        cd app/
      ```
  2. run con