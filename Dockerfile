FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean -f && npm install -g n && npm install express body-parser jsonwebtoken redis moment uuid

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]
