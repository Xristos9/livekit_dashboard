// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [],
  ssr: false,
  alias: {
    '@': resolve(__dirname, './app'),
    '~': resolve(__dirname, './'),
    assets: resolve(__dirname, './app/assets'),
    components: resolve(__dirname, './app/components'),
    public: resolve(__dirname, './public'),
    composables: resolve(__dirname, './composables'),
    layouts: resolve(__dirname, './layouts'),
    pages: resolve(__dirname, './pages'),
    plugins: resolve(__dirname, './plugins'),
    stores: resolve(__dirname, './stores'),
    utils: resolve(__dirname, './utils'),
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  runtimeConfig: {
    // Private values only available server‑side
    // (Not required for public Spaces.)
    // public values are exposed to client
    // Private Airtable credentials (server-only)
    airtable: {
      apiKey: process.env.AIRTABLE_API_KEY,
      baseId: process.env.AIRTABLE_BASE_ID,
      tableName: process.env.AIRTABLE_USERS_TABLE || 'Customers',
      sessionsTable: process.env.AIRTABLE_SESSIONS_TABLE || 'Sessions',
      agentLogsTable: process.env.AIRTABLE_AGENT_LOGS_TABLE || 'Agent Logs',
    },
    doSpaces: {
      key: process.env.NUXT_DO_SPACES_KEY,
      secret: process.env.NUXT_DO_SPACES_SECRET,
      region: process.env.NUXT_DO_SPACES_REGION || 'fra1',
      endpoint: process.env.NUXT_DO_SPACES_ENDPOINT || 'https://fra1.digitaloceanspaces.com',
      bucket: process.env.NUXT_DO_SPACES_BUCKET, // required
    },
    public: {
      defaultSpaceBaseUrl: 'https://aaaaa.fra1.digitaloceanspaces.com',
      defaultPrefix: '',
      spacesPublicBase: process.env.NUXT_DO_SPACES_PUBLIC_BASE || '',
    },
  },
  app: {
    head: {
      title: 'Abyssaltech.AI',
      meta: [{ name: 'viewport', content: 'width=device-width, initialscale=1' }],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/images/logos/logo_icon.png',
        },
      ],
    },
  },
  typescript: {
    shim: false,
  },
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  hooks: {},
})
