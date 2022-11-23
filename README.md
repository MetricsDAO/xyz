# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
yarn install
```

Afterwards, start the Remix development server like so:

```sh
yarn dev
```

Generate the prisma client, run migrations and seed the database:

```sh
yarn setup
```

If you pull down commits with updates to the schema make sure you run migrations:

```sh
yarn prisma migrate dev
```

To reset the database and start fresh you can run the following command to delete database data, run migrations and seed the database:

```sh
yarn reset
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

## TroubleShooting

When setting up first time you may need to run `npm run dev:css` before running npm run dev

## Ladle

Components can be developed in isolation using [Ladle](https://ladle.dev/) by running `npm run ladle:dev`
