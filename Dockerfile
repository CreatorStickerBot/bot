FROM node:17.9.0 AS build

WORKDIR /app

ARG VM_HOST
ARG BACKEND_PORT
ARG BOT_PORT
ARG BUILD_NUM
ARG TG_TOKEN

ENV VM_HOST=$VM_HOST
ENV BACKEND_PORT=$BACKEND_PORT
ENV BOT_PORT=$BOT_PORT
ENV BUILD_NUM=$BUILD_NUM
ENV TG_TOKEN=$TG_TOKEN

COPY . .

RUN npm ci
RUN npm install pm2 -g

CMD ["pm2-runtime", "start", "ecosystem.config.json"]
