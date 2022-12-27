
FROM node:18.12-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

ENV NODE_ENV production

RUN npm run build

FROM nginx:1.23.3-alpine

COPY --from=0 /usr/src/app/build /usr/share/nginx/html
COPY ./tools/env-docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
