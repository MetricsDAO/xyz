## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
yarn install
```

Afterwards, start the Remix development server like so:

```sh
yarn dev
```

If setting up for the first time you may need to run `yarn run dev:css` before running `yarn dev`

Generate the prisma client, run migrations and seed the database:

```sh
yarn setup
```

If you pull down commits with updates to the schema make sure you run migrations:

```sh
yarn prisma migrate dev
```

Sometimes you might also want to generate Typescript types, perhaps after a schema.prisma change

```sh
yarn prisma generate
```

To reset the database and start fresh you can run the following command to delete database data, run migrations and seed the database:

```sh
yarn reset
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Connecting to dev database

Log in to Fly

```sh
flyctl auth login
```

Create tunnel

```sh
fly proxy 5436:5432 -a mdao-db-staging
```

Connect to database

- Host: localhost
- Port: 5436
- User: postgres
- Password: get from a developer
- Database: postgres

## Issues

- There is a known issue with MetaMask where triggering a disconnect using Rainbowkit/Wagmi does not fully disconnect the wallet, and after a page refresh it will still be connected in the browser. The user can disconnect directly through their MetaMask wallet and it will fully disconnect. 
