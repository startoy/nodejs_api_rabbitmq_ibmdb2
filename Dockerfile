FROM node:10.10.0-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 8080

USER node
CMD ["npm", "start"]