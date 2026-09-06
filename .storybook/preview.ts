import type { Component } from 'vue'
import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

import '../src/assets/css/main.css'

// mirror Nuxt's global registration of atoms so `<AtomsBadge>` etc. resolve in stories
const atoms = import.meta.glob<{ default: Component }>('../src/components/atoms/*/index.vue', {
  eager: true,
})
setup((app) => {
  for (const [path, mod] of Object.entries(atoms)) {
    const name = /atoms\/([^/]+)\/index\.vue$/.exec(path)?.[1]
    if (name) app.component(`Atoms${name}`, mod.default)
  }
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: { test: 'todo' }, // 'todo' | 'error' | 'off'

    viewport: { options: INITIAL_VIEWPORTS },
    layout: 'centered',
  },

  initialGlobals: {
    viewport: { value: 'iphone6' },
  },
}

export default preview
