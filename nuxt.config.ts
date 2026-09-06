import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },

  srcDir: 'src',

  modules: ['@nuxt/eslint', '@vercel/speed-insights'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  // pathPrefix keeps the tier in the tag name: atoms/Button → <AtomsButton>
  components: [{ path: '~/components', pathPrefix: true }],

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
