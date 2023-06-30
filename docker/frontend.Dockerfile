FROM node:16-alpine

WORKDIR /ui
RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    make
COPY ./frontend/package* /ui/
RUN more /ui/package*
RUN yarn install
COPY ./frontend /ui