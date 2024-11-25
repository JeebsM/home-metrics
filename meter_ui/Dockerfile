# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.16.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE 5173

CMD  ["npm", "run", "dev", "--force"]
