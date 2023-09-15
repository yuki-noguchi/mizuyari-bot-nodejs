FROM node:18.16.0-alpine

WORKDIR /opt/app

COPY . .

RUN npm install && npx prisma generate --generator client && npm run build

ENV PORT 8080

EXPOSE $PORT

ENTRYPOINT [ "node", "build/app.js" ]