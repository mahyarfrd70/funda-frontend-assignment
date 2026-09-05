import type { Component } from 'vue'
import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

// Same CSS entry the real app uses — every design token (colors, spacing,
// radius, ...) is available in every story, so a component looks in
// Storybook exactly as it will in the app.
import '../src/assets/css/main.css'

// Mirror Nuxt's global auto-registration of our atoms, so molecule/organism
// stories can use `<AtomsBadge>` etc. exactly as the real app does — without
// each story importing and registering them by hand.
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

    a11y: {
      // 'todo' - show a11y violations in the panel only
      // 'error' - fail the test runner on violations
      // 'off'   - skip a11y checks entirely
      test: 'todo',
    },

    viewport: { options: INITIAL_VIEWPORTS },
    // This is a mobile-first app: every story previews at phone width by
    // default. Switch viewport from the toolbar to check sm:/md:/lg:.
    layout: 'centered',
  },

  initialGlobals: {
    viewport: { value: 'iphone6' },
  },
}

export default preview
