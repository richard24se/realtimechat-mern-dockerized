FROM node:16-alpine

WORKDIR /server
RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    make
COPY ./server/package* /server/
# RUN more /server/package*
RUN yarn install
COPY ./server /server