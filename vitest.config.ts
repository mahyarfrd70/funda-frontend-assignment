import path from 'node:path'

import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

import { playwright } from '@vitest/browser-playwright'

const dirname = import.meta.dirname

// projects: "unit" (*.spec.ts), "storybook" (stories as browser tests),
// "e2e" (real server → live API, opt-in)
export default defineConfig(async () => ({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.vue', 'src/**/*.ts', 'server/**/*.ts'],
      exclude: [
        'src/**/*.stories.ts',
        'src/**/*.spec.ts',
        'src/app.vue',
        'server/**/*.spec.ts',
        'server/api/**', // pure glue — logic is in server/utils, composition in the e2e project
      ],
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
          include: ['src/**/*.spec.ts', 'server/**/*.spec.ts'],
          setupFiles: ['./test/vitest-setup.ts'],
        },
      }),
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.spec.ts'],
          environment: 'node',
          testTimeout: 120_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
}))
