# Nodejs, RabbitMQ, IBM-DB2

  <img align="" src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" height="80">
  <img align="" src="https://cdn-images-1.medium.com/max/1200/1*-cHwP37aTACS1XnzA_YnIw.png" height="80">
  <img align="" src="https://img.stackshare.io/service/1029/preview.png" height="80">

  - Nodejs connect to Rabbitmq service
  - Nodejs connect to IBM DB2

# CHANGELOG
- ดูที่ไฟล์ CHANGELOG

# วิธี Update source code (ไม่ต้อง Build image ใหม่)
**ถ้าไม่มีการเพิ่ม/ลด dependencies** แค่ copy src/ ขึ้นไปบน container แล้วสั่ง restart ก็จะได้ src ใหม่แล้ว  
**ถ้ามีการ npm install ... เพิ่ม dependency** ต้อง build images ใหม่  

- ใช้ **node_adm.sh**
1. เอาทั้งโฟลเดอร์ **src/** หรือไฟล์อื่นๆที่มีอัพเดทไปไว้ในโฟลเดอร์ **deploy/**  
2. สั่ง node_adm.sh deploy

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
ถ้าไม่ต้องการ Build image ใหม่ สามารถใช้ไฟล์ Docker image ได้จาก
```sh
\\nas1\securities\SDP\user\prs\Projects\Rabbitmq\Docker Images\nodejs-api_<version>.tar
```  
แล้วไปขั้นตอนที่ 2  

### เมื่อดาวโหลด source code จาก repository นี้ไปแล้ว  
#### 1. สั่งให้ Build Docker Image (เช็ค `Dockerfile`)
  
  ```sh
    cd docker
    chmod +x build.sh
    ./build.sh <version>
  ```
  - version ใส่เวอร์ชัน เช่น 19.01.DB.01 (ถ้าไม่ใส่ จะได้ TAG latest)
      
  ```sh
    REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
    fwg/nodejs-api      19.01.DB.01         8b073de4d04b        8 seconds ago       836MB 
  ```
    
  จะได้ไฟล์ **nodejs-api_$VERSION.tar** และ **image_version.cnf** (todo: ไว้ใช้ตรวจ version)

#### 2. หลังจากได้ Image ไฟล์ ให้ copy ไฟล์ไปวางไว้ที่ server ที่ deploy แล้ว Load image ขึ้น Docker ด้วยคำสั่ง

  ```sh
  docker load -i nodejs-api_$VERSION.tar
  ```

  เช็คว่ามี Image จากคำสั่ง

  ```sh
  docker images
      REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
      fwg/nodejs-api      19.01.DB.01         8b073de4d04b        8 seconds ago       836MB
  ```
  
  ทุกอย่างจะตรงกัน (รวมไปถึงเวลา CREATED)

#### 3. สร้าง Container จาก Image ด้วยคำสั่ง 'node_adm.sh create <TAG_version> <ชื่อ>'

  ```sh
  node_adm.sh create 19.01.DB.01
  
  // or (optionally)
  node_adm.sh create 19.01.DB.01 container-name
  ```
  - พวก environment ในการ config จะอยู่ที่ไฟล์ **env_new_container.sh** --> ความหมายแต่ละ env [Environment Configuration](#environment-configuration)
  - ถ้า run แล้ว Container Exited ให้ดู URI อาจจะผิด --> [RabbitMQ Maintainance](#rabbitMQ-maintainance)
  - uri กรณี rabbit เป็น docker ใช้ ip ของ container rabbit นั้น
  - uri กรณี rabbit เป็น service native ให้ใช้ ip ของเครื่อง (ที่ไม่ใช่ localhost) และ rabbit ต้องสร้าง user, pass ให้สิทธิ์ในการเข้าถึงคิวต่าง ๆ ด้วย 
      
#### 4. ดู container สตาร์ทและใช้งานได้จริงจากคำสั่ง
        
  ```sh
  docker ps
  ```

  ```sh
  curl localhost:15673/version
  ```

#### 5. ดู Container log (พวกที่ออก Console ของ Nodejs) จากคำสั่ง  

  ```sh
  docker logs 771 -f 
  ```

- **771** 3 ตัวแรกของ Container ID/ชื่อ Container
- Log pattern `':date[iso] : :method :url :status :response-time ms - :res[content-length]'`


  ```sh
  2018-12-29T03:17:21.543Z : POST /rpc/test_queue/AMU1017,10170012%20%20,1,10 404 18.899 ms - 1316
  ```  

#### 6. อื่นๆ  

  ```sh
  node_adm.sh h
  ```  

  <img src="./public/node_adm.png">  

**ที่สำคัญ**  
  - **node_adm.sh config \<cid>** เป็นการเขียน container id ลงไฟล์ เพื่อใช้ container id เป็น default  ในการทำคำสั่งต่างๆ
  - ถ้าไม่มี ต้อง pass cname (container name/id ก็ได้) เข้าไปตามหลังพวกคำสั่ง เช่น **deploy \<cname>**, **start \<cname>**

**Command**  
- **deploy** copy ไฟล์ทั้งหมดจากโฟลเดอร์ deploy/* ไปที่ app/ บน Container แล้ว run ให้ใหม่  ถ้ามีการอัพเดทไฟล์หรือ src/ ให้วางไว้ในโฟลเดอร์ deploy/ แล้วรันคำสั่งนี้  
- **start**  start container 
- **stop**  stop container
- **build**  build source code in src/ to build/ in container
- **restart**  restart container *ทำให้ container รันใหม่ src/ จะถูก build ใหม่ด้วย
- **cp**  copy ไฟล์ทั้งหมดจากโฟลเดอร์ deploy/* ไปที่ app/ บน Container  
- **log** ดู log  container (tail log)
- **cplog**  copy โฟลเดอร์ logs/ บน Container ลงมาที่ $pwd เพื่อดู log (กรณีที่ไม่ได้สั่งให้ write log ไปที่ console)
- **create** \<version> \<name>  สร้าง container ชื่อ \<name> ขึ้นมา จาก image \<version>, config ของ container หรือ Node มาจาก env_new_container.sh (ถ้าไม่ใส่ \<name> จะได้ container ชื่อ `nodejs-api` แทน)
- **config** \<cid>  สั่งให้ write \<cid> (container id) ที่เราใช้งานลงไฟล์ config ไว้ เพื่อทำคำสั่งจะได้ไม่ต้อง pass parameter cid เข้าไป
- **checklog**  เช็คขนาดไฟล์ log ของ docker container ที่ออก console (Docker เก็บ log ของ container ที่ออก console ด้วย -- console ออกเยอะ log อาจจะเต็ม ต้องเคลียร์ text ข้างใน เอง เพราะ docker ไม่ลบให้อัตโนมัติ)
- **truncate**  เคลียร์ข้อมูลในไฟล์ log ของ docker container (เคลียร์ข้อมูลข้างใน-ไม่ได้ลบไฟล์)

---

# 2. Run ด้วย Nodejs

## Prerequisites
  
  - `Nodejs` >= 8.9.4 (test on Windows), 8.11.3 (test on Ubuntu16) [Official Download](https://nodejs.org/en/download/)
  - `Source code` (compressed file) [Download on Gitlab](http://gitlab.freewillgroup.com/peerapat_suk/node--rabbitmq)
  - `Rabbitmq server` (Assume broker running on `amqp://localhost`) [Download](https://www.rabbitmq.com/)
  - `IBM DB` เป็น obdc driver สำหรับติดต่อกับ database [See](https://www.npmjs.com/package/ibm_db2). สามารถทดสอบก่อนได้จาก git repo ชื่อ `nodejs-db2` [:gitlab](http://gitlab.freewillgroup.com/peerapat_suk/nodejs-db2)


## ติดตั้ง

  **Install Nodejs dependencies**

  ```sh
  unzip node--rabbitmq-master.zip
  cd node--rabbitmq-master
  npm install
  ```
  
  ```sh
  git clone {this_repo_url.git}
  cd node--rabbitmq
  npm install
  ```

  * หลังจากสั่งคำสั่ง `npm install` เสร็จ, ควรจะมีโฟลเดอร์ `node_modules` ขึ้นมา  

  **Install ibm-db2 driver**

  (ถ้ามี)ไฟล์ obdc cli-driver ให้ export env ชี้ไปที่ path ที่วางไฟล์ไว้  
  ```sh
  // set แล้ว error, ยังไม่ใช้งาน
  export IBM_DB_HOME=$(pwd)/install

  // ใช้
  export IBM_DB_INSTALLER_URL=$(pwd)/install
  ```

  แล้วสั่ง  
  ```sh
  npm install ibm_db
  ```

  - ibm_db ไม่ใช่ ibm_db2 (ถ้าลง ibm_db2 src จะหา module ไม่เจอ)

ถ้า Error อาจจะขาด python ลงด้วย

  ```sh
  sudo apt install node-gyp
  ```

## วิธีสตาร์ท
หลังลง dependencies แล้ว ให้ config node ในไฟล์ env_new_container.sh  
แล้วเช็คว่า environment ถูก config ด้วยคำสั่ง `echo $RB_RPCQUEUE` (จะ echo ตาม config)  
แล้วสั่ง  shell start (อย่าลืม chmod +x npm_adm.sh)

  ```
  npm_adm.sh start

  // or

  ./npm_adm.sh start
  ```
  - เป็น shell สำหรับ npm start โดยใช้ env จาก config ที่เซ็ตไว้

  คำสั่งอื่น ๆ

  ```sh
  npm_adm.sh help
  ```

ถ้าต้องการ Config เอง (ตามตาราง ENVIRONMENT) ให้ใส่ชื่อ env และค่า ก่อน `npm start`  เช่น  

  ```
  NODE_ENV=production npm start
  ```

ตัวอย่าง ถ้า rabbitmq อยู่บน docker ต้องใช้ uri amqp ของ container นั้น  

  ```sh
  AMQPURI=amqp://172.17.xx.xx NODE_ENV=production npm start
  ```

  เช็คว่าใช้ได้หรือไม่

  ```sh
  // ON TERMINAL
  curl localhost:15673/version

  // ON BROWSER
  localhost:15673/version
  ```

# API
Available end point   
ดูใน excel หรือ https://documenter.getpostman.com/view/3529476/RznJmbr8#intro

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
    \\nas1\securities\SDP\user\prs\Projects\Rabbitmq\Docker Images\rabbitmq_3-management.tar

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
  docker run -it -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://172.17.0.2" \
    --name nodejs-api \
    -p 15673:15673 \
    fwg/nodejs-api \
    npm start
  ```

### Rabbitmq อยู่บน Docker, ไม่เปิด log data ไป console
  ```sh
  docker run -it -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://172.17.0.2" \
    -e "WRITEDATA LOGCONSOLE=no" -e "ENABLEDB2=no" \
    --name nodejs-api-1901RB16 \
    -p 15673:15673 \
    fwg/nodejs-api \
    npm start
  ```

### Rabbitmq รันเป็น service native
  ```sh
   docker run -it -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://test:test@13.229.156.31" \
    --name node \
    -p 15673:15673 \
    fwg/nodejs-api \
    npm start
  ```
  - ต้องสร้าง user บน service ใหม่ (ใช้ guest ไม่ได้)
  - ip ของ server

---
## Environment Configuration

| VARIABLE | DEFAULT | EXPECTED | REMARK  | DESCRIPTION |
| -------- | :------ | :------  | :------ | :------ |
|NODE_ENV|`development` | `production` or `development` || mode ของ environment มีผลต่อการแสดง Log |
|WRITEDATALOGCONSOLE|`no`|`yes` or `no`||แสดง Data Log ไปที่ console (data ที่มาจาก okury และ db) |
|WRITEDBLOGCONSOLE|`yes`|`yes` or `no`||แสดง Database Log ไปที่ console |
|WRITENODELOGCONSOLE|`yes`|`yes` or `no`||แสดง Node Log ไปที่ console|
|ENABLEDB2|`yes`|`yes` or `no`| |เปิดใช้งาน Router ในส่วนที่เชื่อมต่อกับ DB2 |
|REPLYWAITTIME|6000|number(ms)||เวลาในการรอตอบกลับจาก Okury |
|PAGESIZE|20|number(ms)||ขนาด page |
| -------- | ------ | ------  | ------ | ------ |
| **RabbitMQ** |  |  |   |  |
| -------- | ------ | ------  | ------ | ------ |
|~~RBHOSTNAME~~|~~`localhost`~~| ~~any hostname~~ | ไม่ใช้งาน | ~~hostname ในการเชื่อมต่อจาก nodejs ไปที่ rabbitmq-server~~|
|~~RBPOR~~T|~~`15672`~~|~~any~~| ไม่ใช้งาน | ~~เลข port~~ |
|AMQPURI| `amqp://localhost` | any string||hostname ในการเชื่อมต่อจาก nodejs ไปที่ rabbitmq-server|
| -------- | ------ | ------  | ------ | ------ |
| **QUEUE** |  |  |   |  |
| -------- | ------ | ------  | ------ | ------ |
|SELFQUEUE|`rabbit.reply-to`| any | ไม่ใช้งาน - Auto gen | ชื่อ queue ของตัวเอง ให้คนอื่นตอบกลับ |
|RPCQUEUE|`test_queue`| any |  | ชื่อ rpc queue เพื่อส่ง message ไป (okruy รอรับ) |
|DIRECTQUEUE| `directQueue`| any | ไม่ใช้งาน | ส่ง message เข้า direct queue |
| -------- | ------ | ------  | ------ | ------ |
| **DATABASE** |  |  |   |  |
| -------- | ------ | ------  | ------ | ------ |
|DBCODEPAGE|`874`| any |  | CodePage ที่คุยกันระหว่าง DB2-CLI กับ Server |
|DBHOST|`10.22.19.13`| any | | ชื่อ host |
|DBPORT| `50001`| any | | port |
|DBNAME|`fisdb_nt`| any | | ชื่อ database |
|DBTABLE|`SECCALLFORCERATETAB`| any | | ชื่อ table |
|DBUSER| `db2inst1`| any | | login username |
|DBPWD| `db2inst1`| any | | login password |

---
## Fix Terminated Container  
- https://stackoverflow.com/a/32353134

## cURL

```sh
curl --location --request POST "http://{{serverURL}}/db/querysec" \
  --header "Content-Type: application/json" \
  --data "{
	\"fields\" : [ \"SECSYMBOL\", \"MRGCODE\", \"FORCE_SMV\"],
	\"page\" : 1,
	\"page_size\": 5
}"
```

```sh
curl --location --request GET "http://{{serverURL}}/db/querysec?page=1" \
  --header "Content-Type: application/json" \
  --data ""
```


## LEGACY - WILL NOT UPDATE

if you need amqp.lib as reuse function. feel free to use it


development mode

```s
[INFO ] 2019-01-10 @ 19:29:14:545 [DevLog] ~> Get AMU1017,10170012  ,BLISS,1,10 Type string
[INFO ] 2019-01-10 @ 19:29:14:545 [NodeRB] ~> NodeRecv [AMU] [AMU1017,10170012  ,BLISS,1,10]
[INFO ] 2019-01-10 @ 19:29:14:545 [DevLog] ~> Sending message[AMU1017,10170012  ,BLISS,1,10] Queue[test_queue]
[INFO ] 2019-01-10 @ 19:29:14:545 [DevLog] ~> Wait Time 6000 ms
[INFO ] 2019-01-10 @ 19:29:14:546 [NodeRB] ~> RPCSend [AMU] [AMU1017,10170012  ,BLISS,1,10]
[INFO ] 2019-01-10 @ 19:29:14:546 [DevLog] ~> Calling sendRPCMessage...
[INFO ] 2019-01-10 @ 19:29:14:548 [DevLog] ~> Call sendRPCMessage Succeed...
[INFO ] 2019-01-10 @ 19:29:14:552 [DevLog] ~> Promise Race Done
[INFO ] 2019-01-10 @ 19:29:14:553 [NodeRB] ~> RPCRecv [RMU] [RMU,1017,                             Trader Test for ISV##
,10170012  ,Customer Test for Implement#2
,1,1,40000,0,0,1,BLISS               ,N, ,100,0.35,0.40,0.25,0.30,10000,4,40000,0,0,2,*]
[INFO ] 2019-01-10 @ 19:29:14:553 [NodeRB] ~> Message [RMU]  return data object
[INFO ] 2019-01-10 @ 19:29:14:553 [NodeRB] ~> NodeSend [RMU] Obj:[{"MsgType":"RMU","TraderID":"1017","TraderName":"                             Trader Test for ISV##\n","cust_no":"10170012  ","cust_name":"Customer Test for Implement#2                     \n","page":"1","total_page":"1","total_mkt":"40000","total_call":"0","total_force":"0","loop_count":"1","data":[{"stock_symbol":"BLISS               ","grade":"N","stock_type":" ","mrg_code":"100","call_lmv":"0.35","call_smv":"0.40","sell_lmv":"0.25","sell_smv":"0.30","actual_vol":"10000","lastsale":"4","mkt_value":"40000","call_margin":"0","call_force":"0","avg_cost":"2","ending_flag":"*"}]}]
GET /rpc/test_queue/AMU1017,10170012%20%20,BLISS,1,10 304 15.432 ms - - 
```

production mode

```s
[INFO ] 2019-01-10 @ 19:30:16:143 [NodeRB] ~> NodeRecv [AMU] [AMU1017,10170012  ,BLISS,1,10]
[INFO ] 2019-01-10 @ 19:30:16:144 [NodeRB] ~> RPCSend [AMU] [AMU1017,10170012  ,BLISS,1,10]
[INFO ] 2019-01-10 @ 19:30:16:151 [NodeRB] ~> RPCRecv [RMU] [RMU,1017,                             Trader Test for ISV##
,10170012  ,Customer Test for Implement#2
,1,1,40000,0,0,1,BLISS               ,N, ,100,0.35,0.40,0.25,0.30,10000,4,40000,0,0,2,*]
[INFO ] 2019-01-10 @ 19:30:16:152 [NodeRB] ~> Message [RMU]  return data object
[INFO ] 2019-01-10 @ 19:30:16:152 [NodeRB] ~> NodeSend [RMU] Obj:[{"MsgType":"RMU","TraderID":"1017","TraderName":"                             Trader Test for ISV##\n","cust_no":"10170012  ","cust_name":"Customer Test for Implement#2                     \n","page":"1","total_page":"1","total_mkt":"40000","total_call":"0","total_force":"0","loop_count":"1","data":[{"stock_symbol":"BLISS               ","grade":"N","stock_type":" ","mrg_code":"100","call_lmv":"0.35","call_smv":"0.40","sell_lmv":"0.25","sell_smv":"0.30","actual_vol":"10000","lastsale":"4","mkt_value":"40000","call_margin":"0","call_force":"0","avg_cost":"2","ending_flag":"*"}]}]
```