# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## DigitalOcean App Platform

To deploy on [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform):

1. Push this repository to your own GitHub account.
2. In the DigitalOcean control panel create a new **App** and point it at your repository.
3. Use the following settings when prompted:
   - **Build command:** `npm install && npm run build`
   - **Run command:** `npm start`
4. Ensure any required environment variables (such as `AIRTABLE_API_KEY` or `NUXT_DO_SPACES_KEY`) are added in the App Platform dashboard.

DigitalOcean automatically sets the `PORT` environment variable used by the Nuxt server, so no additional port configuration is necessary.
