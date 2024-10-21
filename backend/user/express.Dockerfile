FROM node:lts-alpine AS build
WORKDIR /data/user-express
COPY package*.json ./
RUN npm install
ARG env
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/user-express
COPY --from=build /data/user-express/package*.json ./
COPY --from=build --chown=node:node /data/user-express/dist ./dist

RUN npm ci --omit=dev
# For migration
RUN npm install tsx drizzle-kit
COPY drizzle ./drizzle
COPY src/lib/db/ ./src/lib/db
COPY src/lib/passwords ./src/lib/passwords
COPY src/config.ts ./src
COPY tsconfig.json .
COPY entrypoint.sh .

ARG port
EXPOSE ${port}
ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]