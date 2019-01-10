# Nodejs, RabbitMQ, IBM-DB2

  <img align="" src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" height="80">
  <img align="" src="https://cdn-images-1.medium.com/max/1200/1*-cHwP37aTACS1XnzA_YnIw.png" height="80">
  <img align="" src="https://img.stackshare.io/service/1029/preview.png" height="80">
  
  - Nodejs act as API
  - Nodejs connect to Rabbitmq service
  - Nodejs connect to IBM DB2

# CHANGELOG

### 02/12/2018
  - UPDATE VERSION 19.01.DB.01
    - แก้ไขให้สามารถเชื่อมต่อ DB2 ได้ แก้โดยการตั้ง process.env.DB2CODEPAGE = **874**
    - ย้าย Dockerfile เก่าไปไว้ในโฟลเดอร์ install

# วิธี Update source code (ไม่ต้อง Build image ใหม่)
**ถ้าไม่มีการเพิ่ม/ลด dependencies** แค่ copy src/ ขึ้นไปบน container แล้วสั่ง restart ก็จะได้ src ใหม่แล้ว  
**ถ้ามีการ npm install ... เพิ่ม dependency** ต้อง build images ใหม่  

- ใช้ **shell/cpdocker.sh**
1. เอาทั้งโฟลเดอร์ **src/** ที่มีอัพเดท ไปไว้ในโฟลเดอร์ **shell/**  
2. สั่ง cpdocker.sh

- **logdocker.sh** ดู logs
- **rmvdocker.sh** ลบ log ของ docker container

# วิธี Build Source เป็น Docker Image (10/01/2019)

  ขั้นตอนการ build source ให้เป็น docker image แทน ในกรณีที่เครื่องไม่สามารถลง nodejs ได้โดยตรง แต่ต้องใช้ docker ได้
  
## Prerequisite
  - Internet access  
  - **Docker**
  - **Node** Docker Images
  - Source code

### แยกเป็น 2 version

**@DEPRECATED**  
**Lite** ไม่ต้องต่อกับ DB2 ไม่ต้องใช้ lib ของ linux ทั้งหมด ได้ image ขนาดเล็ก   
**TODO: ใน src ยังมีต่ออยู่ อาจ error ต้องแก้ src**
  - **Node** ใช้ Version **>= `node:10.10.0-alpine`**  
      ```sh
      docker pull node:10.10.0-alpine
      ```

**Full** มีการเชื่อมต่อกับ IBM DB2 ต้องลง cli-driver ถึงจะเรียก database ได้ แต่ driver ต้องใช้ libgcc, python, libssl ... ซึ่งใน node alpine ไม่มี  ได้ image ขนาดใหญ่  
  - **Node** ใช้ Version **>= `node:10.10.0`**
      ```sh
      docker pull node:10.10.0
      ```
---

## Build Step
เมื่อดาวโหลด source code จาก repository นี้ไปแล้ว  

  1. สั่งให้ build docker image (เช็ค `Dockerfile`)

      ```sh
      cd docker
      chmod +x build.sh
      ./build.sh <version>
      ```
      - version ใส่เวอร์ชัน เช่น 19.01.DB.01 ถ้าไม่ใส่ จะได้ TAG latest
      ```sh
        REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
        fwg/nodejs-api      latest              c4dfedfd51ae        8 seconds ago       836MB 
      ```
    
      จะได้ไฟล์ **nodejs-api.tar**

  2. หลังจากได้ Image ไฟล์ ให้ copy ไฟล์ไปวางไว้ที่ server ที่ deploy แล้ว Load image ขึ้น Docker ด้วยคำสั่ง

      ```sh
      docker load -i nodejs-api.tar
      ```

      เช็คว่ามี Image จากคำสั่ง

      ```sh
      docker images
          REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
          fwg/api-rabbit      latest              a2554eac0192        8 seconds ago       95.8MB
      ```

  5. สตาร์ท Container จาก Image ด้วยคำสั่ง

      ```sh
      docker run -d \
        -e "NODE_ENV=development" -e "AMQPURI=amqp://172.17.0.2" \
        --name nodejs-api \
        -p 15673:15673 \
        fwg/nodejs-api \
        npm start 
      ```
      - `-d` รันแบบ background. 
      - `--name` เปลี่ยนชื่อ container 
      - `-p` แมพพอร์ตจาก **'hostport':'containerport'**  
      - `fwg/api-rabbit` ชื่อ Repository Image ที่จะเอามารัน
      - `npm start` Execute command, if not provided will use default command from Dockerfile.
      - `-m` Limit the max memory use of this container.
      - `-e ENV=value` pass Parameter ชื่อ ENV ค่า value เข้า Nodejs  

      **ENVIRONMENT LIST**
      - สามารถดู config อื่นๆ ได้ที่ `lib/config.js`
      - **NODE_ENV** Mode ที่จะสตาร์ท Nodejs, Default ถ้าไม่ส่งค่าคือ development (ถ้าใช้จริงควรส่งค่า `production`). ex NODE_ENV=production
          - `development` จะแสดง DevLog ของการเรียกฟังก์ชันต่างๆ และเก็บลงไฟล์ที่ `logs/messages_dev/` + แสดง log Request api และเก็บลงไฟล์ที่ `logs/` 
          - `production` จะแสดงเฉพาะ log NodeRB ที่สำคัญๆ และเก็บลงไฟล์ไว้ที่ `logs/messages/` + ไม่แสดง log Request api แต่เก็บลงไฟล์ log
      - **PORT** เลข port ที่ต้องการให้ Nodejs สตาร์ท (Default เมื่อไม่ส่งคือ 15673). ex PORT=8000
          - ต้องแมพ -p ให้ตรงด้วย
      - **AMQPURI** กำหนด rabbitmq uri.
          - ถ้า amqp รันด้วย docker(ไม่ใช่ service/process ที่ลงเองบนเครื่อง) ให้ใช้ ip ของ docker container แทน ip เครื่อง เช่น `amqp://172.17.0.x` (ดูจาก docker network inspect bridge)
          - ถ้า logs จาก node ขึ้น ACCESS_ERROR อาจจะต้อง login ด้วย account จะใช้ uri รูปแบบ `amqp://username:password@ip`  
          - อื่นๆ [URI SPEC](https://www.rabbitmq.com/uri-spec.html) for more.
      - **REPLYWAITTIME** เวลาที่จะให้รอการ response เมื่อขอ msg แบบ RPC (default 6000) ในหน่วย ms. ex REPLYWAITTIME=6000
    
      แล้วดู Container จากคำสั่ง
      
  4. ดู container สตาร์ทและใช้งานได้จริงจากคำสั่ง
            
      ```sh
      docker ps
      ```
      ![]() 
      ```sh
      curl localhost:15673/version
      ```

  5. ดู Container log (พวกที่ออก Console ของ Nodejs) จากคำสั่ง

      ```sh
      docker logs 771 -f 
      ```
      - **771** 3 ตัวแรกของ Container ID/ชื่อ Container
      - log pattern `':date[iso] : :method :url :status :response-time ms - :res[content-length]'`
        ```sh
        2018-12-29T03:17:21.543Z : POST /rpc/test_queue/AMU1017,10170012%20%20,1,10 404 18.899 ms - 1316
        ```

---

# 2. Run ด้วย Nodejs (Not Update)

## Prerequisites
  
  - `Nodejs` >= 8.9.4 (test on Windows), 8.11.3 (test on Ubuntu16) [Official Download](https://nodejs.org/en/download/)
  - `Source code` (compressed file) [Download on Gitlab](http://gitlab.freewillgroup.com/peerapat_suk/node-api-rabbitmq)
  - `Rabbitmq server` (Assume broker running on `amqp://localhost`) [Download](https://www.rabbitmq.com/)


## ติดตั้ง

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
  * หลังจากสั่งคำสั่ง `npm install` เสร็จ, ควรจะมีโฟลเดอร์ `node_modules` ขึ้นมา

## วิธีสตาร์ท
หลังลง dependencies แล้ว ให้สั่งคำสั่ง 
  ```
  npm start
  ```
   - for developing testing etc.
   - เห็น log, logdev, log request router ออกจอ

  ```
  NODE_ENV=production npm start
  ```
   - for production
   - เห็น log เก็บ log ลงไฟล์, ไม่เก็บและไม่เห็น logdev
   
default NODE_ENV คือ development  
default port คือ **15673**  
default uri amqp คือ amqp://localhost  
config อื่นๆ ให้อิงตามที่ **ENVIRONMENT LIST**  


ตัวอย่าง ถ้า rabbitmq อยู่บน docker ต้องใช้ uri amqp ของ container นั้น  
  ```sh
  AMQPURI=amqp://172.17.xx.xx NODE_ENV=production npm start
  ```

  เช็คว่าใช้ได้หรือไม่
  ```sh
  // ON TERMINAL
  curl localhost:15673/ 

  // ON BROWSER
  localhost:15673
  ```

  ![]()

# API
Available end point API

กำหนด Base url คือ 
```sh 
 http://localhost:15673
```

- `spacebar` หรือช่องว่างต้องแทนด้วย `%20`  
  
## BASE
#### **`/`**
  - **METHOD** : GET
  - **DESCRIPTION** : index page
  - **PARAMETERS** : -
  - **EX** : localhost:15673/
  - **RESPONSE** : -

#### **`/version`**
  - **METHOD** : GET
  - **DESCRIPTION** : ดูเวอร์ชันของ API
  - **EX** : localhost:15673/version
  - **RESPONSE** : API Version xx.xx.xx.xx (html)
  
## RPC
 ส่ง message เข้าคิว RPC API จะรอตอบกลับจาก Server แล้วตอบ Client

#### **`/rpc`**
- **METHOD** : GET
- **DESCRIPTION** : index page of rpc
- **PARAMETERS** : -
- **EX** : localhost:15673/rpc/
- **RESPONSE** : -

#### **`/rpc/:queue/:message`**
  - **METHOD** : GET
  - **DESCRIPTION** : ดูเวอร์ชันของ API
  - **PARAMETERS** :
    - **:queue** : ชื่อ rpc queue ที่จะส่ง
    - **:message** : msg ที่จะส่ง
  - **EX** : localhost:15673/rpc/test_queue/AMU1017,10170012%20%20,1,10
  - **RESPONSE** : ยังไม่มี format  

## DIRECT
 ส่ง message เข้า direct queue
#### **`/direct`**
  - **METHOD** : GET
  - **DESCRIPTION** : index page of direct
  - **PARAMETERS** : -
  - **EX** : -
  - **RESPONSE** : -  



# DEV NOTE
  maintenance ต่างๆ ที่เกี่ยวข้อง  

## RabbitMQ

ส่วนนี้เป็นวิธีสตาร์ท RabbitMQ Service ขึ้นมา

### สตาร์ทจาก Docker Image ของ Rabbitmq
  * ถ้าต้องใช้ Internet Access !!  
   Pull image จากคำสั่ง
    ```sh
    docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```
    - `5672` AMQP Port
    - `15672` Management Port

  * ถ้าไม่มี Internet Access!
   ให้ทำการ Load ไฟล์ Image มาใช้แทนการ Pull (เหมือนการสตาร์ท Nodejs) ไฟล์อยู่ที่:
    ```sh
    \\nas1\securities\SDP\user\prs\RabbitMQ\Docker Images\rabbitmq_3-management.tar

    // copy ไปที่ server แล้ว Load ขึ้น Docker
    docker load -i rabbitmq_3-management.tar
    ```
    แล้วสั่งคำสั่ง:
    ```sh
    docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```
#### ถ้าต้องการลง Service แบบไม่ใช้ Docker [Click](https://www.rabbitmq.com/download.html) .

## RabbitMQ Maintainance
  All available detail. [See more](https://www.rabbitmq.com/rabbitmqctl.8.html)
  - Install
    ```sh
    // RabbitMQ
    docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3

    // RabbitMQ Plugin
    // access inside localhost
    docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3-management

    // or access outside the host
    docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 rabbitmq:3-management
    ```
    - access via http://container-ip:15672 
    - access outside the host via http://localhost:8080 or http://host-ip:8080

### Plugin
- Management - เป็นหน้าเว็บ Monitor. จัดการ rabbitmq
  ```sh
  rabbitmq-plugins enable rabbitmq_management
  ```
### COMMAND
อาจต้อง sudo ด้วย  

- สร้าง Admin user บน rabbitmq
  ```sh
  rabbitmqctl add_user test test
  rabbitmqctl set_user_tags test administrator
  rabbitmqctl set_permissions -p / test ".*" ".*" ".*"
  ```
  - [ดู User Management อื่นๆ](https://www.rabbitmq.com/rabbitmqctl.8.html#User_Management)  

- ปิด/เปิด App
  ```sh
  rabbitmqctl start_app
  rabbitmqctl stop_app
  ```
- Reset rabbitmq
  ```sh
  rabbitmqctl stop_app
  rabbitmqctl reset
  rabbitmqctl force_reset
  ```
#### Queue
- ลบ messages ทั้งหมดทิ้ง
  ```sh
  rabbitmqctl purge_queue 
  ```
- ดู list_queues, list_exchanges and list_bindings
  ```sh
  rabbitmqctl list_* 
  ```
-  [-> Server Status](https://www.rabbitmq.com/rabbitmqctl.8.html#Server_Status) อื่น ๆ

#### Other
- Report
  ```sh
  rabbitmqctl report > server_report.txt
  ```

---
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

- ถ้าใช้ sh ไม่ได้ ให้ใช้ bash แล้วไปลง vim บน container (ใช้ internet)
  ```sh
  docker exec -it <container> bash
  apt-get update
  apt-get install vim
  ```

## เชื่อมต่อ amqp ของ RabbitMQ
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
## Start Container แบบต่างๆ  
### Rabbitmq อยู่บน Docker
  ```sh
  docker run -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://172.17.0.2" \
    --name node-api-rabbit \
    -p 15673:15673 \
    fwg/api-rabbit:19.04.DB.01 \
    npm start
  ```
  - inspect network ดู ip

### Rabbitmq รันเป็น service native
  ```sh
   docker run -it -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://test:test@13.229.156.31" \
    --name node \
    -p 15673:15673 \
    fwg/api-rabbit:19.01.DB.01 \
    npm start
  ```
  - ต้องสร้าง user บน service ใหม่ (ใช้ guest ไม่ได้)
  - ip ของ server


---
## Fix Terminated Container  
- https://stackoverflow.com/a/32353134

## LEGACY - WILL NOT UPDATE

if you need amqp.lib as reuse function. feel free to use it
