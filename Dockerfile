FROM node:10.10.0-alpine

WORKDIR /app
COPY . /app
RUN npm install
RUN chmod a+x node_modules/.bin/*

EXPOSE 8080
CMD ["npm", "start"]