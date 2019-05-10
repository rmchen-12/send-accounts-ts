FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /app/

COPY ["package.json", "yarn.lock", "./"]
RUN yarn --registry https://registry.npm.taobao.org

COPY . .


ENTRYPOINT ["node", "./dist/server.js"]