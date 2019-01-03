# Nodejs API to Rabbitmq

  repository นี้ เป็น API เขียนจาก nodejs (express) เพื่อส่ง message เข้าไปที่คิวของ rabbitmq service
  rabbitmq service จะมี c รอรับอ่านคิว เพื่อคิวรี่เอาข้อมูลและส่งกลับมาที่ api, api จะส่งต่อไป client/requester

# CHANGELOG
## HOT FIX !!
  - Version **19.01.DB.01** ถ้ารันด้วย Docker image ที่ build ให้ ให้ทำการ docker scp src/ id:app/src แล้ว restart ใหม่  

### 02/12/2018
  - UPDATE VERSION 19.01.DB.01
    - แก้ไขให้สามารถเชื่อมต่อ DB2 ได้ แก้โดยการตั้ง process.env.DB2CODEPAGE = **874**
    - ย้าย Dockerfile เก่าไปไว้ในโฟลเดอร์ install  

### 25/12/2018
  - เพิ่ม Version แยก 18.04.DB.01 ให้ทำงานร่วมกับ IBM DB2
    - ต้องใช้ node version เต็ม (~ 800-900 MB) เพื่อลง db2 cli driver เนื่องจาก node version alpine ติดพวก lib ต่างๆ เช่น libcrypt.so.1, libpam ..  
    - ให้ไปเรียกคำสั่ง `docker build..` ใน path **/install** แทน

# 1. Run ด้วย Nodejs

## Prerequisites
   
  <img align="center" src="https://www.rabbitmq.com/img/RabbitMQ-logo.svg" height="35"> 
  <img align="center" src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" height="80">
   
  
  - `Nodejs` >= 8.9.4 (test on Windows), 8.11.3 (test on Ubuntu16) [Official Download](https://nodejs.org/en/download/)
  - `Source code` (compressed file) [Download on Gitlab](http://gitlab.freewillgroup.com/peerapat_suk/node-api-rabbitmq)
  - `Rabbitmq server` (Assume broker running on `amqp://localhost`) [Download](https://www.rabbitmq.com/)


## ติดตั้ง
### --> ถ้าเชื่อมต่อ Internet ได้ 
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

### --> ถ้าเชื่อมต่อ Internet ไม่ได้

  ให้ดาวโหลดโฟลเดอร์ `node_modules` มาใส่แทน จาก path:
  ```sh
  \\nas1\securities\SDP\user\prs\RabbitMQ\api_rabbitmq_node_modules.zip
  ```
  ย้ายไฟล์ .zip ไปที่โฟลเดอร์ของโปรเจ็คนี้ แล้วแตกไฟล์ .zip
  ```sh
  mv api_rabbitmq_node_modules.zip node-api-rabbitmq-master
  unzip api_rabbitmq_node_modules.zip
  ```

  - ถ้าเกิด error `'permission denied rimraf...'` ให้ chmod permission **.bin** ใน **node_modules**

  ```sh
  chmod a+x node_modules/.bin/*
  ```

---

## วิธีสตาร์ท
  หลังลง dependencies แล้ว ให้สั่งคำสั่ง 
  ```
  npm start
  ```
  - default NODE_ENV คือ development (มองเห็น log dev, log request router ออกจอ)
  - default port คือ **15673**
  - default uri amqp คือ amqp://localhost

  *ถ้าสตาร์ท production mode (ไม่เก็บและไม่เห็น log dev, เก็บ log ลงไฟล์)
  ```sh
  NODE_ENV=production npm start
  ```

  *ถ้าสตาร์ทด้วย docker ต้องใช้ uri amqp ของ container
  ```sh
  AMQPURI=amqp://172.17.xx.xx NODE_ENV=production npm start
  ```

  แล้วเช็ค
  ```sh
  // ON TERMINAL
  curl localhost:15673/ 

  // ON BROWSER
  localhost:15673
  ```

  หน้าจอจะแสดงผล
  
  ![](content/nodejs_result.JPG)

---

  ตัวอย่าง
  **Request Okury (sent message to queue `test_queue`)**
  ```sh
  curl localhost:15673/rpc/test_queue/APF50050005%20%20,F,5005,,1,8
  curl localhost:15673/rpc/test_queue/AMU1017,10170012%20%20,1,10
  ```
---

# 2. build source เป็น docker image แล้วสตาร์ทจาก docker

  สเต็บนี้จะเป็นการ build source ให้เป็น docker image แทน ในกรณีที่เครื่องไม่สามารถลง nodejs ได้โดยตรง แต่ใช้ docker ได้
  
## สิ่งที่ต้องมี
### Version เก่า ที่ต่ำกว่า 19.xx.xx.xx

  - **ต้องมี** Internet access !!
  - ลง **Docker** แล้ว
  - มี Docker image `Node` ซึ่ง `repo:tag` ควรที่จะ **>= `node:10.10.0-alpine`**  
    สามารถดึง image ได้จากคำสั่ง
      
      ```sh
      docker pull node:10.10.0-alpine
      ```
  - `Source code` ( ไฟล์ดูจาก #1 )

### Version ตั้งแต่ 19.01.DB.01

  - ใช้ Node image version **node:10.10.0** เนื่องจาก DB2 ต้องใช้ libc (ระวัง disk เต็ม)
  ```sh
  docker pull node:10.10.0
  ```
  
---
  TODO: If no internet access build instruction 
  - See above adapt with  `# Setup with no internet access`
  - Then edit Dockerfile to not `npm install`
  - Add `RUN chmod a+x node_modules/.bin/*`  
  - Follow normal build step

---

### Docker image ที่ build มาให้แล้ว (ข้าม step build)
  - ดาวโหลด:

      ```sh
      \\nas1\securities\SDP\user\prs\RabbitMQ\Docker Images\noderb_<version>.tar
      ```
    แล้วข้ามไป Step 4 ได้เลย

## Step การ Build
เมื่อดาวโหลด source code จาก repository นี้ไปแล้ว  

  1. Extract .zip file แล้ว cd ไปที่ `node-api-rabbitmq-master/` (โฟลเดอร์ที่ได้จากการแตกไฟล์)

      ```sh
      // ถ้าใช้ zip แตกไฟล์
      unzip node-api-rabbitmq-master.zip

      // ถ้าใช้ tar แตกไฟล์
      tar -xvzf node-api-rabbitmq-master.tar.gz

      cd node-api-rabbitmq-master/
      npm install
      ```
  2. สั่งให้ build docker image (จะรันโค้ดตามไฟล์ชื่อ `Dockerfile`)

      ```sh
      docker build -t fwg/api-rabbit:<version> .
      ```
      - version ใส่เวอร์ชัน เช่น 19.01.DB.01 ถ้าไม่ใส่ จะได้ TAG latest

      เช็คว่าได้ image หรือยัง จากคำสั่ง

      ```sh
      docker images
        REPOSITORY                TAG                 IMAGE ID            CREATED              SIZE
        fwg/api-rabbit            latest              d8457d449ae1        About a minute ago   96.6 MB
      ```
      - **fwg/api-rabbit** สามารถเปลี่ยนเป็นชื่อ repository อะไรก็ได้
  3. สั่งให้ Export image บน docker กลายเป็นไฟล์ .tar

      ```sh
      docker save -o noderb_<version>.tar fwg/api-rabbit:TAG
      ```
      - `noderb_<version>.tar` ชื่อไฟล์หรือpathที่จะ export ออกมา (ต้องใส่ .tar ด้วย)
      - `fwg-api-rabbit` ชื่อ repository บน docker ถ้ามี TAG ให้ใส่ด้วย ถ้าเป็น latest ไม่ต้องใส่
      - `:TAG` ถ้า image TAG latest ไม่ต้องใส่ ให้ลบออก

  - `ตอนนี้จะต้องได้ไฟล์ 'noderb_<version>.tar' !!`

  4. หลังจากได้ Image ไฟล์ ให้ copy ไฟล์ไปวางไว้ที่ Server แล้ว Load image ขึ้น Docker ด้วยคำสั่ง

      ```sh
      docker load -i noderb_<version>.tar
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
        --name node-api-rabbit \
        -p 15673:15673 \
        fwg/api-rabbit:19.01.DB.01 \
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
      
      ```sh
      docker ps
      ```
      ![](content/node_api_rabbit.JPG)
      
  6. ดูว่า Container สตาร์ทและใช้งานได้จริงจากคำสั่ง

      ```sh
      // ON TERMINAL
      curl localhost:15673/ 

      // ON BROWSER
      localhost:15673
      ```

      ควรจะได้ตอบกลับตามนี้
      
      ![](content/nodejs_result.JPG) 

      Request Okury(sent message to queue `test_queue`)
      ```sh
      curl localhost:15673/rpc/test_queue/APF50050005%20%20,F,5005,,1,8
      curl localhost:15673/rpc/test_queue/AMU1017,10170012%20%20,1,10
      ```

  7. ดู Container log (พวกที่ออก Console ของ Nodejs) จากคำสั่ง

      ```sh
      docker logs 771 -f 
      ```
      - **771** 3 ตัวแรกของ Container ID/ชื่อ Container
      - **-f** Follow log output
      - ดูจาก docker ps (ถ้า ps ไม่ได้ ให้รันด้วย root)
      - log pattern `':date[iso] : :method :url :status :response-time ms - :res[content-length]'`
      ```sh
      2018-12-29T03:17:21.543Z : POST /rpc/test_queue/AMU1017,10170012%20%20,1,10 404 18.899 ms - 1316
      ```

  8. Test tool (untest)

      ```sh
      ./api_loop_test.sh <port>
      ```
      * **\<port\>** API Port

---

# RabbitMQ
ส่วนนี้เป็นวิธีสตาร์ท RabbitMQ Service ขึ้นมา
## สตาร์ทจาก Docker Image ของ Rabbitmq
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

---

# API
available end point API ที่มี

กำหนด base url คือ 
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

---

# MY DEV NOTE
  Nothing to see here, you can delete all this below.
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
    -e "NODE_ENV=development" -e "AMQPURI=amqp://test:test@13.229.136.216" \
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
