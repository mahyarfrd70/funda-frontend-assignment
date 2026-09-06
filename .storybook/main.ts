import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/vue3-vite',

  // give Storybook's Vite build what Nuxt provides: Tailwind + path aliases
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    const { default: vue } = await import('@vitejs/plugin-vue')

    config.plugins ??= []
    config.plugins.push(tailwindcss(), vue())

    config.resolve ??= {}
    config.resolve.alias = {
      ...(Array.isArray(config.resolve.alias) ? {} : config.resolve.alias),
      '#shared': fileURLToPath(new URL('../shared', import.meta.url)),
      '~': fileURLToPath(new URL('../src', import.meta.url)),
      '~~': fileURLToPath(new URL('..', import.meta.url)),
    }

    return config
  },
}
export default config
