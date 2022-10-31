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
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

## TroubleShooting

When setting up first time you may need to run `npm run dev:css` before running npm run dev

## Ladle

Components can be developed in isolation using [Ladle](https://ladle.dev/) by running `npm run ladle:dev`

## Tailwind and Mantine

Tailwind and Mantine have significant enough overlap to cause confusion. Both were included for ease and speed of development. Tailwind makes layouts easy and Mantine has a feature-rich component library. However there are some trade-offs.

Developers should look to use Mantine for almost everything except layout. Avoid using these components:

```
Stack
Grid
Group
Box
```

To avoid FOUC, do not combine Tailwind classNames with Mantine components. You might be able to use the `unstyled` attribute in some cases.

```tsx
// Bad
<Text className="text-blue-500">I will flash blue for a quick second before Mantine overrides the color</Text>

// Better
<Text unstyled className="text-blue-500">Should be blue</Text>

// Best
<Text sx={{ color: "blue" }}>Is blue</Text>
// Or...
<Text color="blue">Is blue</Text>
```

### Quirks

- Remix integration - The official docs suggest adding the @mantine/remix ClientProvider in the entry.client.tsx. However if you do this, it breaks styles on the production build of the app. See this [Issue](https://github.com/mantinedev/mantine-remix-template/issues/4) and this [Comment](https://github.com/mantinedev/mantine/issues/2311#issuecomment-1264549626).
