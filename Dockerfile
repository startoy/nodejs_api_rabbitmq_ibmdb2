FROM node:10.10.0-alpine

WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]