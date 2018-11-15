# Nodejs to Rabbitmq

  This repository provided api for request data by sent message to specific queue using RabbitMQ

# 1. Run on NodeJS

## Prerequisites
   
  <img align="center" src="https://www.rabbitmq.com/img/RabbitMQ-logo.svg" height="35"> 
  <img align="center" src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" height="80">
   
  
  - `Nodejs` >= 8.9.4 (test on Windows), 8.11.3 (test on Ubuntu16) [Official Download](https://nodejs.org/en/download/)
  - `Source code` (compressed file) [Download on Gitlab](http://gitlab.freewillgroup.com/peerapat_suk/node-api-rabbitmq)
  - `Rabbitmq server` (Assume broker running on `amqp://localhost`) [Download](https://www.rabbitmq.com/)


## Setup
### # Setup with internet access
  Install dependencies

  ```sh
  unzip node-api-rabbitmq-master.zip
  cd node-api-rabbitmq-master
  npm install
  ```
  
  ```sh
  git clone {this_repo_url.git}
  cd node-api-rabbitmq
  npm install
  ```
  * After execute `npm install`, folder `node_modules` should be appeared

### # Setup with no internet access

  If cannot access the Internet, Download `node_modules` following path below
  ```sh
  \\nas1\securities\SDP\user\prs\RabbitMQ\api_rabbitmq_node_modules.zip
  ```
  Move file .zip to repository directory and unzip it
  ```sh
  mv api_rabbitmq_node_modules.zip node-api-rabbitmq-master
  unzip api_rabbitmq_node_modules.zip
  ```
  - *`Optionally`* chmod the `.bin` if some error occur like `'permission denied rimraf..'`
  ```sh
  chmod a+x node_modules/.bin/*
  ```

## Run
  After installed dependencies, Now we can run the api node by execute:
  ```sh
  npm start
  ```
  And check 
  ```sh
  // ON TERMINAL
  curl localhost:8080/ 

  // ON BROWSER
  localhost:8080
  ```

  At the end, Result should be like this
  
  ![](content/nodejs_result.JPG) 

  `TODO: Prevent serving api server if there is error on connect to Rabbitmq Broker. (Currently no check if Rabbit-Server exist or not`

  Request Okury(sent message to queue `test_queue`)
  ```sh
  curl localhost:8080/rpc/test_queue/APF50050005%20%20,F,5005,,1,8
  ```
  
## Command 

  - `build` : Transpiles using Babel `./src` to `./app`

      ```sh
      npm run build
      ```

  - `serve` : main application in ./app (which is server.js)
  
      ```sh
      npm run serve
      ```

  - `start` : `build` + `serve`
  
      ```sh
      npm start
      ```
  // TODO:
  - `test` : Test if files in ./src can transpile with Babel using `Mocha` 
  
      ```sh
      npm test
      ```

# 2. Build Source To Docker Image And Run Container

  this will build from source code to Docker image.
  
## Require

  - *MUST* Internet access !!
  - Docker image `Node` which `repo:tag` should be >= `node:10.10.0-alpine`
      
      ```sh
      docker pull node:10.10.0-alpine
      ```

  - `Source code` compressed file ( same as `Run on NodeJS` section )

  ### TODO: If no internet access build instruction 
  - See above adapt with  `# Setup with no internet access`
  - Then edit Dockerfile to not `npm install`
  - Add `RUN chmod a+x node_modules/.bin/*`
  - Follow normal build step

 ### If you have this repository Docker image file .tar
  - Download from:

      ```sh
      \\nas1\securities\SDP\user\prs\RabbitMQ\Docker Images\api_rabbit_image.tar
      ```
    Then skip to step 4.

## Step

  1. Extract .zip file and cd to `node-api-rabbitmq-dev/`

      ```sh
      // if using zip
      unzip node-api-rabbitmq-master.zip

      // if using tar
      tar -xvzf node-api-rabbitmq-master.tar.gz

      cd node-api-rabbitmq-master/
      ```
  2. Build the image (this read `Dockerfile`)

      ```sh
      docker build -t fwg/api-rabbit .
      ```

      Check if image exist

      ```sh
      docker images
        REPOSITORY                TAG                 IMAGE ID            CREATED              SIZE
        fwg/api-rabbit            latest              d8457d449ae1        About a minute ago   96.6 MB
      ```

  3. Export the images from docker to .tar file

      ```sh
      docker save -o api_rabbit_image.tar fwg/api-rabbit
      ```
      - `api_rabbit_image.tar` name the path to image tar file (MUST PROVIDE .tar to it)
      - `fwg-api-rabbit` name of repository on docker

  - `NOW WE GOT AN IMAGE 'api_rabbit_image.tar' !!`

  4. After we got an image file. We copy it to server, Then import image .tar file to server that have Docker by execute

      ```sh
      docker load -i api_rabbit_image.tar
      ```

      Check if images exist

      ```sh
      docker images
          REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
          fwg/api-rabbit      latest              a2554eac0192        8 seconds ago       95.8MB
      ```

  5. Run container from images

      ```sh
      docker run -d \
        -e "NODE_ENV=development" -e "AMQP_URI=amqp://10.22.26.23" \
        --name node-api-rabbit \
        -p 8080:8080 \
        -m "300M" \
        fwg/api-rabbit \
        npm start 
      ```
      - `-d` Run process in background. 
      - `--name` Custom container name. 
      - `-p` Map port which is `'hostport':'containerport'`. 
      - `fwg/api-rabbit` Name of repository to be used.
      - `npm start` Execute command, if not provided will use default command from Dockerfile.
      - `-m` Limit the max memory use of this container.
      - `-e NODE_ENVIRONMENT` Change to other word if not in development. (ex. `production`)
      - `-e "AMQP_URI"` Specific Rabbitmq uri.
          - See [URI SPEC](https://www.rabbitmq.com/uri-spec.html) for more.
      - Other ENV pass to config see `config.js`
    
      Now we should see the container running
      
      ```sh
      docker ps
      ```
      ![](content/node_api_rabbit.JPG)
      
  6. Verify if succeed to start docker container.

      ```sh
      // ON TERMINAL
      curl localhost:8080/ 

      // ON BROWSER
      localhost:8080
      ```

      At the end, Result should be like this
      
      ![](content/nodejs_result.JPG) 

      Request Okury(sent message to queue `test_queue`)
      ```sh
      curl localhost:8080/rpc/test_queue/APF50050005%20%20,F,5005,,1,8
      ```

  7. See container's logs

      ```sh
      docker logs 771 -f 
      ```
      - `771` First 3 characters of container id
      - `-f` Follow log output

  8. Test tool

      ```sh
      ./api_loop_test.sh <port>
      ```
      * `<port>` API Port

# Rabbitmq
This instruction provide how to run a Rabbitmq's service
## Run Docker Image Rabbitmq
  * Internet access required !
   This will pull the images from docker hub.
    ```sh
    docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```
    - `5672` AMQP Port
    - `15672` Management Port

  * No Internet access required !
   Load image file .tar to Docker, You can find following path below.
    ```sh
    \\nas1\securities\SDP\user\prs\RabbitMQ\Docker Images\rabbitmq_3-management.tar

    // Copy it to server, Then load image to docker
    docker load -i rabbitmq_3-management.tar
    ```
    Then execute:
    ```sh
    docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```
  #### If need install service as native you can find [HERE](https://www.rabbitmq.com/download.html) .
    
  *Happy Hacking! :3*

# MY DEV NOTE
  Nothing to see here, you can delete all this below.
## ERROR
  ```
  TypeError: Cannot read property 'createChannel' of undefined
  ``` 
 - Change the uri, Dedicate that not found specific uri.
## COMMAND
  ```sh
  // Go in container
  docker exec -it <id> sh

  // execute <command> to container (ex. npm start)
  docker exec -it <id> <command>
  ```
## Connect to Rabbitmq
### From Container
 
  ```sh
  docker network inspect bridge
  ```
To see the ip4 of the container

Then on .js where is `amqp://localhost` change this to `amqp://172.17.0.x` follow the rabbitmq container's ip

### From Outside Container

  Maybe `amqp://localhost` or `amqp://127.0.0.1` or `amqp://0.0.0.0` or use with port `5672`

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

  


