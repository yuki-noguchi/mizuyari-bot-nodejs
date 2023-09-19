FROM node:18.16.0-alpine AS build

WORKDIR /opt/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json

COPY packages/common packages/common
COPY packages/linebot packages/linebot

RUN npm install

RUN npx -w @mizuyari-bot-nodejs/common prisma generate --generator client
RUN npm run build -w @mizuyari-bot-nodejs/linebot

FROM node:18.16.0-alpine

WORKDIR /opt/app

COPY --from=build /opt/app/node_modules node_modules
COPY --from=build /opt/app/packages/common packages/common
COPY --from=build /opt/app/packages/linebot packages/linebot

ENV PORT 8080

EXPOSE $PORT

ENTRYPOINT [ "node", "packages/linebot/build/src/app.js" ]