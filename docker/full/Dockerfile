FROM node:10.10.0

WORKDIR /app
COPY . /app

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV IBM_DB_INSTALLER_URL /app/install
RUN npm install ibm_db && npm install
RUN npm run build

RUN rm -rf /app/src && rm -rf /app/install & rm -rf /app/docker

EXPOSE 15673
CMD ["npm", "start"]