import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    // Leaflet is only pulled in via a dynamic import inside the map component;
    // pre-bundling it keeps Vite from re-optimising (and hard-reloading) the
    // first time a visitor opens a listing detail page in dev
    optimizeDeps: { include: ['leaflet'] },
  },

  srcDir: 'src',

  modules: ['@nuxt/eslint', '@vercel/speed-insights'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  // pathPrefix keeps the tier in the tag name: atoms/Button → <AtomsButton>.
  // '~/components/pages' is a second root so page-specific components read as
  // <ListingDetailHeader>, not <PagesListingDetailHeader>.
  components: [
    { path: '~/components', pathPrefix: true, ignore: ['pages/**'] },
    '~/components/pages',
  ],

  runtimeConfig: {
    fundaApiKey: '',
    fundaApiBase: 'https://partnerapi.funda.nl/feeds/Aanbod.svc/json',
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },
})
