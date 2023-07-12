# base node image
FROM node:19-bullseye-slim as base
ENV NODE_ENV production
RUN apt-get update && apt-get install -y openssl
RUN apt-get install -y python3 g++ make
RUN yarn global add turbo

FROM base as pruner
WORKDIR /app
COPY . .
RUN yarn install
RUN turbo prune --scope=mdao-indexer --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base as installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
# Install only the deps needed to build the target
RUN yarn install


FROM base as builder
WORKDIR /app
COPY --from=pruner /app/.git ./.git
COPY --from=pruner /app/out/full .
COPY --from=installer /app/ .
RUN turbo db:generate
RUN turbo run build --filter=mdao-indexer...

FROM builder as runner
CMD ["yarn", "--cwd", "apps/indexer", "start:indexer"]
