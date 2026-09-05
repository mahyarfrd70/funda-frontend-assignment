// Type-only counterpart to `test/vitest-setup.ts`'s runtime import.
//
// `@testing-library/jest-dom/vitest` augments Vitest's `Assertion<T>`
// interface with matchers like `toBeInTheDocument`/`toHaveAttribute`. That
// augmentation only applies to files inside the same TypeScript program, and
// Nuxt's generated tsconfig (.nuxt/tsconfig.app.json) includes root-level
// `*.d.ts` files but not the `test/` folder itself — so this import has to
// live here, at the repo root, for `pnpm typecheck` (and the editor's TS
// server) to see it. Same reason `vitest.shims.d.ts` already does this for
// @vitest/browser-playwright.
import '@testing-library/jest-dom/vitest'
