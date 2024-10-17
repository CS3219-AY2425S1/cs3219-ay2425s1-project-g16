FROM node:lts-alpine AS build
WORKDIR /data/collab-express
COPY package*.json ./
RUN npm install
ARG env
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/collab-express
COPY --from=build /data/collab-express/package*.json ./
COPY --from=build --chown=node:node /data/collab-express/dist ./dist

RUN npm ci --omit=dev

RUN sed -i 's|./ws|ws|g' ./dist/ws.js

COPY entrypoint.sh .

ARG port
EXPOSE ${port}
ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]