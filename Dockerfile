FROM node:16

WORKDIR /usr/src/app

COPY package*.json yarn.lock tsconfig.json ./

RUN yarn 

COPY . .

RUN yarn build

EXPOSE 4000

# CMD cp .env build/ && cp tsconfig.json build/ && cd ./build && node -r tsconfig-paths/register server.js
CMD ["yarn", "run", "start"]
