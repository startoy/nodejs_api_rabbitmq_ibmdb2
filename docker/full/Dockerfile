FROM node:10.10.0

WORKDIR /app
COPY . /app

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
# now run as new user nodejs from group nodejs
#USER nodejs

ENV IBM_DB_INSTALLER_URL /app/install
RUN npm install ibm_db && npm install
RUN npm run build

RUN rm -rf install/ & rm -rf docker/
RUN rm -r Dockerfile && rm -rf install/

EXPOSE 15673
CMD ["npm", "start"]