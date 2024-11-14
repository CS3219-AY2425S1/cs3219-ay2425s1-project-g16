FROM node:20-alpine

WORKDIR /app/
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./

ARG port
EXPOSE ${port}

CMD ["npm", "run", "dev", "--", "--host"]
