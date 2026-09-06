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

  // '~/components/pages' is registered as its own root so the tier drops from
  // the tag name: pages/about/Intro → <AboutIntro>, not <PagesAboutIntro>
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
