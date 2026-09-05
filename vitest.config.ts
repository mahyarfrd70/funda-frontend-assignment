import path from 'node:path'

import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

import { playwright } from '@vitest/browser-playwright'

const dirname = import.meta.dirname

// Two Vitest projects, run together with `pnpm test`:
//  - "storybook": every *.stories.ts is executed as a browser test (via
//    Playwright), catching interaction/render regressions in component
//    variants — see https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
//  - "unit": plain *.spec.ts component/composable/util tests, run inside a
//    real (but headless) Nuxt context via @nuxt/test-utils, so auto-imports,
//    <NuxtLink>, etc. all resolve exactly like they do in the app.
export default defineConfig(async () => ({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.vue', 'src/**/*.ts'],
      exclude: ['src/**/*.stories.ts', 'src/**/*.spec.ts', 'src/pages/**', 'src/app.vue'],
      // `all: true` instruments every included file, not just the ones a
      // test happens to import — otherwise an untested file simply doesn't
      // appear in the report, and the % looks better than it is. This is
      // what makes the 75% pre-push gate (below) a meaningful check rather
      // than one that only ever measures files someone already tested.
      all: true,
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
    },
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      await defineVitestProject({
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts'],
          setupFiles: ['./test/vitest-setup.ts'],
        },
      }),
    ],
  },
}))
