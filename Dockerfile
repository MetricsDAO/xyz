# base node image
FROM node:19-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl git python3 build-essential

# Install all node_modules, including dev dependencies
FROM base

WORKDIR /myapp

ADD package.json ./
ADD yarn.lock ./
RUN yarn install --production=false --frozen-lockfile

ADD prisma .
RUN npx prisma generate

ADD . .
RUN yarn build

CMD ["yarn", "start"]
