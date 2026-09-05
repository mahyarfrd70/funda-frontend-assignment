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

  // Reuse the app's own Tailwind pipeline so component previews are styled
  // with the same design tokens as the real app — no separate Storybook
  // theme to keep in sync.
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    const { default: vue } = await import('@vitejs/plugin-vue')
    config.plugins ??= []
    config.plugins.push(tailwindcss(), vue())
    return config
  },
}
export default config
