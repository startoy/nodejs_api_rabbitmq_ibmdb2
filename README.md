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

  - build: Transpiles using Babel `./src` to `./app`

      ```sh
        npm run build
      ```

  - serve: Run the main application in ./app (which is server.js)
  
      ```sh
        npm run serve
      ```

  - start: `build` + `serve`
  
      ```sh
        npm start
      ```

  - test: Test if files in ./src can transpile with Babel using `Mocha` 
  
      ```sh
        npm test
      ```

# 2. Run on Docker

  If run this node api through docker image

## Prerequisites

  - `Docker` Version >= 17.03.2-ce, build f5ec1e2 (test on Ubuntu14)
    * If Centos7 should install using binary (test Docker version 18.03.0-ce, build 0520e24)

## Run from Docker image [ ## NOT COMPLETE. IN TODO: LIST, DON'T USE ! ]

  - After load image file (.tar) to Docker, Run following command below.\
    this will map the current directory to inside container's directory.\
  
  ```sh
    mkdir app
    cd app
  ```

  - then execute

  ```sh
    FIXME:
    docker run \
      -d -it \
      --name container_name \
      -v "$(pwd)":/app \
      -w /app \
      -p 3000:3000 \
      repo:tag \
      npm start

     docker run -d --name node-api-rabbit -p 8080:8080 fwg/api-rabbit npm start 
  ```


# 3. Build Source To Docker Image

  this will build Docker image from source code.
  
## Require

  - Docker image `Node` which `repo:tag` should be >= `node:10.10.0-alpine`
      
      ```sh
        docker pull node:10.10.0-alpine
      ```

  - Source code compressed file
    * Use `node-api-rabbitmq-dev.zip` if server access the internet normally.
    * Use `node-api-rabbitmq-dev_w_modules.zip` if server offlines or can not access the internet. 
  - *MUST* Internet access !!

## Step
  TODO:
  Assume you have a project .zip file `node-api-rabbitmq-dev.zip` and folder `/node-api-rabbitmq-dev` in it.

  1. Extract .zip file and cd to `node-api-rabbitmq-dev/`

      ```sh
        // if using zip
        unzip node-api-rabbitmq-dev.zip

        // if using tar
        tar -xvzf node-api-rabbitmq-dev.tar.gz

        cd node-api-rabbitmq-dev/
      ```
  2. Build the image using `Dockerfile`

      ```sh
        docker build -t fwg/api-rabbit .
      ```

      - `-t` provide repository:tag
      - `.` path where `Dockerfile` exist

      Check if image exist

      ```sh
        docker images
          REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
          fwg/api-rabbit            test                da6d92132463        7 minutes ago       69.9 MB
      ```

  6. Export the images from docker to .tar file

      ```sh
        docker save -o apiRabbit.tar fwg/api-rabbit
      ```
      - `apiRabbit.tar` name the path to image tar file (MUST PROVIDE .tar to it)
      - `fwg-api-rabbit` name of image or repository on docker

  7. Import image tar file to server that have Docker as you wish then execute

      ```sh
        docker load -i apiRabbit.tar
      ```
      - where `<path to image tar file>` is path to image tar file

      Check if images exist on server

      ```sh
        docker images
            REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
            fwg/api-rabbit      latest              a2554eac0192        8 seconds ago       95.8MB
      ```

  8. Run container to serve service

      ```sh
        docker run -d --name node-api-rabbit -p 8080:8080 fwg/api-rabbit npm start 
      ```
      - `-d` run process in background. \
      - `--name` custom container name. \
      - `-p` map port whereis host port:containerport. \
      - `fwg/api-rabbit` name of repository, if no tag provided, will use latest. \
      - `npm start` running command, if not provided will use default command from Dockerfile.

  9. See Docker logs

      ```sh
        docker logs 438 -f 
      ```
      `438` first 3 characters of container id

# Rabbitmq
## Run Docker Image Rabbitmq

  ```sh
    docker run -d --name rabbit -p 5672:5672 -p 8080:15672 rabbitmq:3-management
  ```
  * Should change `8080` to another port
## Connect to Rabbitmq
### From Container
Execute 
  ```sh
    docker network inspect bridge
  ```
To see the ip4 of the container

Then on .js where is `amqp://localhost` change this to `amqp://172.17.0.x` follow the rabbitmq container's ip

### From Outside Container

  Maybe `amqp://localhost` or `amqp://127.0.0.1` or `amqp://0.0.0.0` or use with port `5672`



# MY DEV NOTE

If edit src in docker container make sure you did `docker exec -it <3cid> npm run build` then `docker restart <3cid>`
- `<3cid>` is first 3 character of CONTAINER ID.

`TODO:` Make shell script to run with custom port which set by user or config. \
`TODO:` Dynamic log file to server's folder (since Ifrit cannot execute docker without root permission).

Test with nodejs on docker exec
  
  ```sh
    docker run -d -it --name nodejs10 -v "$(pwd)":/home -w /home node:10.10.0-alpine

    docker exec -it 886 <cmd>
  ```

  ```sh
    docker network inspect bridge

  ```

  
## ERROR
 `TypeError: Cannot read property 'createChannel' of undefined` - Change the uri, Dedicate that not found specific uri.

