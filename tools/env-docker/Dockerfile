
FROM node:18.12-alpine3.17 as frontend-builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV production

RUN npm run build

FROM nginx:1.23.3-alpine

COPY --from=frontend-builder /usr/src/app/build /usr/share/nginx/html
COPY ./tools/env-docker/set-env.sh /usr/share/nginx/html
COPY ./tools/env-docker/set-env-cli.sh /usr/share/nginx/html
COPY ./tools/env-docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
