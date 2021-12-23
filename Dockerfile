FROM node:17-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM node:17-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 11923

CMD [ "npm", "start" ]
