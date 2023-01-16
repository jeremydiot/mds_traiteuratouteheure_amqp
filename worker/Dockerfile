FROM node:16-alpine
USER root
WORKDIR /app

COPY package.json package.json
RUN npm install

COPY . .

ENTRYPOINT [ "sh", "entrypoint.sh" ]