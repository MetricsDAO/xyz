## Development

First time setup

```sh
# install deps
yarn install
yarn build
# start up services (e.g. database)
yarn docker
# seed the database
yarn tsx prisma/seed.ts
```

Otherwise

```sh
# start indexer and app
yarn dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Tracer and indexing

```sh
# create a tracer called "mdao-development" using dev contract configuration (-d)
yarn pine create-tracer mdao-development 1.6.1 -d
# start tracer
yarn pine start-tracer mdao-development 1.6.1
# view tracers
yarn pine list-tracers
```

Developers can switch between using development and production contracts by changing the `ENVIRONMENT` env var. `ENVIRONMENT="development"` and `ENVIRONMENT="production"`.

You can then also use the `PINE_SUBSCRIBER_OVERRIDE` env var to create ephemeral Mongo databases when you want to "reindex". For example, `PINE_SUBSCRIBER_OVERRIDE="dev-computer-1"`.

## Issues

- There is a known issue with MetaMask where triggering a disconnect using Rainbowkit/Wagmi does not fully disconnect the wallet, and after a page refresh it will still be connected in the browser. The user can disconnect directly through their MetaMask wallet and it will fully disconnect. [https://github.com/rainbow-me/rainbowkit/issues/807](Link to report of issue here)
