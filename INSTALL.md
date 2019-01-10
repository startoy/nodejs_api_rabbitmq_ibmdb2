
# INSTALL INSTRUCTION

## nodejs connect DB2 version 
### Prerequisites
- ต้องมี internet
- ต้อง pull images **node:10.10.0** มาที่ docker ไว้แล้ว -> `docker pull node:10.10.0`
- build ไม่ได้ใช้ internet ในการดาวโหลด แต่ใช้เรียกตอน npm install ibm_db เพื่อ verify package.. บางอย่าง

### Install
1. อยู่ที่ PATH แรกของ Repository
2. สั่ง **docker build -t fwg/api-rabbit:<`VERSION`> .**
    - ต้องมี Dockerfile อยู่
3. docker images ดู **fwg/api-rabbit      <`VERSION`>**
4. สั่งสร้าง container 
    ```sh
    docker run -it -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://172.17.0.2" \
    --name node \
    -p 15673:15673 \
    v .:/app \
    fwg/api-rabbit:<`VERSION`> \
    npm start
    ```
    - **AMQPURI** - เครื่อง Cloud Amazon ใช้ mq จาก service บนเครื่อง ต้องสร้าง user:pass ใหม่ จะใช้ `AMQPURI=amqp://test:test@13.229.136.216`

## Local Map (Cloud)

```sh
docker run  -d \
    -e "NODE_ENV=development" -e "AMQPURI=amqp://test:test@13.229.136.216" \
    --name node \
    -p 3000:15673 \
    fwg/api-rabbit:18.04.DB.01 \
    npm start
```
- `-v "$(pwd)":/app -w /app \` if node same version machine:container

ลง vim ใส่ node images
```sh

docker exec -it <container> bash  
apt-get update  
apt-get install vim  
```

