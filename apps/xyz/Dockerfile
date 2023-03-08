FROM node:19-bullseye-slim as base
RUN apt-get update && apt-get install -y openssl git python3 build-essential
RUN npm i -g pnpm
WORKDIR /app

FROM base as builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=xyz --docker


# Add lockfile and package.json's of isolated subworkspace
# First install the dependencies (as they change less often)
FROM base as installer
WORKDIR /app
COPY .gitignore .gitignore
COPY .npmrc .npmrc
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the app
COPY --from=builder /app/out/full .
RUN pnpm build --filter=xyz

FROM base as runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=installer /app/apps/xyz/remix.config.js .
COPY --from=installer /app/apps/xyz/package.json .

CMD pnpm start
