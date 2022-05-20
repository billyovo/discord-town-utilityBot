FROM node:lts-buster-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .


RUN npm install


COPY ./ .

CMD ["node","index.js"]