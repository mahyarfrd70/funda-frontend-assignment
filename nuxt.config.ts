import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Tailwind v4 is CSS-first (no tailwind.config.js): the Vite plugin
  // compiles src/assets/css/main.css, which imports Tailwind and defines
  // this project's design tokens via `@theme`.
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },

  // Project layout: everything Nuxt auto-scans (pages, components,
  // composables, utils, layouts...) lives under src/. server/ and public/
  // stay at the repo root — Nitro is a separate runtime, not app code.
  srcDir: 'src',

  modules: ['@nuxt/eslint', '@vercel/speed-insights'],

  // Strict TS everywhere. Full type-checking runs in CI via `pnpm typecheck`
  // (kept out of the dev server so HMR stays fast).
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Two component roots, two different naming rules:
  //  - '~/components' (excluding pages/) — default pathPrefix keeps the tier
  //    name as a prefix: atoms/Button -> AtomsButton, organisms/AppHeader ->
  //    OrganismsAppHeader, etc.
  //  - '~/components/pages' registered as its OWN root — "pages" itself
  //    never appears in the prefix, but the page-name folder underneath it
  //    still does: pages/about/Intro -> AboutIntro, not PagesAboutIntro.
  components: [
    { path: '~/components', pathPrefix: true, ignore: ['pages/**'] },
    '~/components/pages',
  ],

  // Server-only secrets live in the top level; anything under `public` is
  // exposed to the client. Values are overridden at runtime by NUXT_* env vars
  // (see .env.example) — nothing sensitive is committed.
  runtimeConfig: {
    fundaApiKey: '', // NUXT_FUNDA_API_KEY
    fundaApiBase: 'https://partnerapi.funda.nl/feeds/Aanbod.svc/json', // NUXT_FUNDA_API_BASE
  },

  eslint: {
    config: {
      stylistic: false, // formatting is Prettier's job
    },
  },
})
