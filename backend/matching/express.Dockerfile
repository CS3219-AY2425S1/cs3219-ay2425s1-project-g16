FROM node:lts-alpine AS build
WORKDIR /data/match-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/match-express
COPY --from=build /data/match-express/package*.json ./
COPY --from=build --chown=node:node /data/match-express/dist ./dist

RUN npm ci --omit=dev

COPY src/lib/db ./src/lib/db
COPY src/lib/utils ./src/lib/utils
COPY src/config.ts ./src
COPY tsconfig.json .
COPY entrypoint.sh .

ARG port
EXPOSE ${port}
ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]