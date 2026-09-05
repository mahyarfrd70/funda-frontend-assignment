import path from 'node:path'

import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

import { playwright } from '@vitest/browser-playwright'

const dirname = import.meta.dirname

// Vitest projects:
//  - "unit": plain *.spec.ts under src/ and server/ — component/composable/
//    util tests, run inside a real (but headless) Nuxt context via
//    @nuxt/test-utils so auto-imports, <NuxtLink> etc. resolve as in the app.
//  - "storybook": every *.stories.ts executed as a browser test (Playwright).
//  - "e2e": spins up the real Nuxt server and hits /api/* end to end. Opt-in
//    (`pnpm test:e2e`) — it's slow and calls the live Funda API.
//
// `pnpm test` runs "unit"; `pnpm test:all` runs unit + storybook.
export default defineConfig(async () => ({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.vue', 'src/**/*.ts', 'server/**/*.ts'],
      exclude: [
        'src/**/*.stories.ts',
        'src/**/*.spec.ts',
        'src/pages/**',
        'src/app.vue',
        'server/**/*.spec.ts',
        // Route handlers are pure glue: param check → fundaFetch → normalize
        // → return. Every branch (isListingId, buildFundaUrl, mapFundaError,
        // the normalizers) is unit-tested in server/utils; the composition
        // itself is covered by the "e2e" project against the live API.
        'server/api/**',
      ],
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
