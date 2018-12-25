FROM node:10.10.0

WORKDIR /app
COPY ../. /app

ENV IBM_DB_INSTALLER_URL /app/install
RUN npm install
RUN npm install ibm_db

EXPOSE 15673
CMD ["npm", "start"]
