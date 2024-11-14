FROM node:lts-alpine AS build
WORKDIR /data/chat-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/chat-express
COPY --from=build /data/chat-express/package*.json ./
COPY --from=build --chown=node:node /data/chat-express/dist ./dist

RUN npm ci --omit=dev

# For migration
RUN npm install tsx drizzle-kit
COPY drizzle ./drizzle
COPY src/lib/db/ ./src/lib/db
COPY src/config.ts ./src
COPY tsconfig.json .
COPY entrypoint.sh .

ARG port
EXPOSE ${port}
ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]