FROM node:16

WORKDIR /usr/src/app

COPY package*.json yarn.lock tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 4000

CMD ["yarn", "run", "start"]
