
# INSTALL INSTRUCTION 

## nodejs connect DB2 version 
### PRE
- ต้องมี internet
- กำหนด WORKDIR คือ ./ (หน้าที่มี package.json, folder อื่นๆ)
- ต้อง pull images **node:10.10.0** มาที่ docker ไว้แล้ว
- build ไม่ใช้ internet ในการดาวโหลด แต่ใช้เรียกตอน npm install ibm_db เพื่อ verify package.. บางอย่าง

### Install
1. copy Dockerfile จาก install/ มาที่ WORKDIR
2. แตกไฟล์ node_module.zip มาวางที่ WORKDIR
3. สั่ง **docker build -t fwg/api-rabbit:18.04.DB.01 .**
4. docker images ดู **fwg/api-rabbit      18.04.DB.01**
5. สั่งสร้าง container 
    ```sh
    docker run -it -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://172.17.0.2" \
    --name node \
    -p 3000:15673 \
    fwg/api-rabbit:18.04.DB.01 \
    npm start
    ```
    - **AMQPURI** - เครื่อง Cloud Amazon ใช้ mq จาก service บนเครื่อง ต้องสร้าง user:pass ใหม่ จะใช้ `AMQPURI=amqp://test:test@13.229.136.216`

