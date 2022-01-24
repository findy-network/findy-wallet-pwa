
FROM node:16.13.2-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV production

RUN npm run build

FROM nginx:1.21.5-alpine

COPY --from=0 /usr/src/app/build /usr/share/nginx/html
COPY ./tools/env-docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
