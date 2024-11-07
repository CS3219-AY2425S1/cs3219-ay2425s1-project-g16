FROM node:20-alpine AS build

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ARG FRONTEND_PORT
EXPOSE ${FRONTEND_PORT}

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]