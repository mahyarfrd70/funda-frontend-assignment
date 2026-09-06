# Funda — Frontend Assignment

A two-page property app built against Funda's Partner API: a **listing results** page and
a **listing detail** page with a photo gallery, key facts, and an interactive map.

**Live:** https://funda-frontend-assignment-m4d3s7su2-mahyarfrds-projects.vercel.app/

Mobile-first, server-rendered, and the Funda API key never reaches the browser.

---

## Stack

| Area                   | Choice                                                     | Notes                                                                                        |
| ---------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Framework              | **Nuxt 4** (Vue 3.5, Nitro)                                | SSR + a small server layer, file-based routing                                               |
| Language               | **TypeScript**, `strict`                                   | plus `noUncheckedIndexedAccess`                                                              |
| Styling                | **Tailwind CSS v4**                                        | CSS-first — design tokens live in `@theme`, no `tailwind.config.js`                          |
| Component workshop     | **Storybook 10** (`@storybook/vue3-vite`)                  | a11y + interaction addons; every story also runs as a browser test                           |
| Unit / component tests | **Vitest 4** + `@nuxt/test-utils` + `@testing-library/vue` | components render in a real (headless) Nuxt context                                          |
| Map                    | **Leaflet** + OpenStreetMap tiles                          | no API key, no signup                                                                        |
| Lint / format          | **ESLint** (`@nuxt/eslint`, flat config) + **Prettier**    | `prettier-plugin-tailwindcss` sorts classes                                                  |
| Git hooks              | **Husky**                                                  | `pre-commit` = lint + typecheck + test, `pre-push` = 75% coverage gate                       |
| Hosting                | **Vercel** (runs the app as a Docker container)            | CI in `.github/workflows/deploy.yml`; `@vercel/speed-insights` for real-user Core Web Vitals |

Package manager: **pnpm**. Runtime: **Node 22 or 24 LTS**.

---

## Getting started

```bash
# 1. install
pnpm install

# 2. environment — the Funda Partner API key is read server-side only
cp .env.example .env
#   then set NUXT_FUNDA_API_KEY in .env to the temporary key from the assignment brief:
#   NUXT_FUNDA_API_KEY=76666a29898f491480386d966b75f949

# 3. run
pnpm dev            # → http://localhost:3000
```

`pnpm install` runs `nuxt prepare` and wires up the Git hooks automatically — nothing else
to set up.

### Production build (optional)

```bash
pnpm build          # → .output/  (self-contained Nitro server)
pnpm preview        # serve the production build locally
```

---

## Commands

| Command                                 | What it does                                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm dev`                              | dev server with HMR, http://localhost:3000                                         |
| `pnpm build` / `pnpm preview`           | production build / serve it locally                                                |
| `pnpm lint` / `pnpm lint:fix`           | ESLint                                                                             |
| `pnpm format` / `pnpm format:check`     | Prettier                                                                           |
| `pnpm typecheck`                        | `vue-tsc` over the whole project                                                   |
| `pnpm storybook`                        | Storybook, http://localhost:6006                                                   |
| `pnpm build-storybook`                  | static Storybook build                                                             |
| `pnpm test`                             | unit tests (`src/` + `server/`), once                                              |
| `pnpm test:watch`                       | unit tests in watch mode                                                           |
| `pnpm test:storybook`                   | run every story as a browser test                                                  |
| `pnpm test:all`                         | unit + storybook                                                                   |
| `pnpm test:e2e`                         | spin up Nuxt and hit `/api/*` against the **live** Funda API (slow, needs network) |
| `pnpm coverage`                         | unit tests + coverage report (fails under 75%)                                     |
| `pnpm docker:build` / `pnpm docker:run` | build / run the container image                                                    |

---

## Testing

Three Vitest **projects** (`vitest.config.ts`):

- **`unit`** — `*.spec.ts` next to each component, next to each page, and under `server/`.
  Components and pages are rendered with `@nuxt/test-utils`' `renderSuspended`, so Nuxt
  auto-imports, `<NuxtLink>`, etc. resolve exactly as in the app. The page specs are
  integration tests: the Nitro endpoints are mocked with `registerEndpoint`, and they
  assert the happy path plus the empty / error / 404 states end to end. Queries follow
  Testing Library convention (`getByRole`, `getByText`) — asserting on what a user or
  assistive tech perceives, not on implementation details.
- **`storybook`** — every `*.stories.ts` is executed as a real browser test (Playwright),
  catching render/interaction regressions in each component variant.
- **`e2e`** — boots the real Nuxt server and calls `/api/listings` and
  `/api/listings/:id` end to end against the live Funda feed. Opt-in (`pnpm test:e2e`),
  kept out of `pnpm test` and the hooks because it's slow and needs network.

```bash
pnpm test            # everyday: fast unit tests
pnpm test:all        # unit + storybook (what CI runs)
pnpm coverage        # + coverage, 75% gate on statements/branches/functions/lines
pnpm test:e2e        # integration against the live API
```

Coverage is set to `all: true` — every file under `src/` and `server/` counts, not just
the ones a test happens to import, so the 75% gate is meaningful. Route handlers
(`server/api/**`) are excluded: they're pure glue (param check → fetch → normalise →
return); the branching logic lives in `server/utils/*` and is unit-tested, and the
composition is covered by the `e2e` project.

---

## Project structure

```
src/
  assets/css/
    main.css                  # imports Tailwind + the token files
    tokens/                   # the design system — one file per concern
      colors.css  spacing.css  typography.css  radius.css  shadows.css
  components/
    atoms/                    # Button, Badge
    molecules/                # ListingCard, PhotoGallery, KeyFacts, FeatureGroups, PropertyMap
    organisms/                # AppHeader, AppFooter
    pages/                    # components used by exactly one page (about/Intro)
  layouts/
    default.vue               # header + <slot> + footer
  pages/
    index.vue                 # listing results  — useFetch('/api/listings')
    listings/[id].vue         # listing detail   — useFetch('/api/listings/:id')
  app.vue                     # <NuxtLayout><NuxtPage /></NuxtLayout>

server/                       # Nitro — a separate runtime, not "app" code
  api/
    listings.get.ts           # GET /api/listings       → proxies Funda's koop feed
    listings/[id].get.ts      # GET /api/listings/:id    → proxies Funda's detail endpoint
  utils/
    funda.ts                  # the one place the API key is used + pure helpers
    normalize.ts              # raw Funda payload → clean view models

shared/
  types/listing.ts            # the normalized types — imported by server/ and pages
```

Each component lives in its own folder as `ComponentName/index.vue`, with its
`*.spec.ts` and `*.stories.ts` alongside it.

### Atomic Design — with rules, not just names

The component tiers each have hard constraints:

| Tier          | May import       | Data layer / routes?                     | In one sentence                                                                       |
| ------------- | ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| **atoms**     | nothing          | ❌                                       | smallest useful piece — props in, emits out, renders with zero context                |
| **molecules** | atoms            | ❌                                       | a small group of atoms doing one job; presentation logic only                         |
| **organisms** | molecules, atoms | ✅ may fetch / read stores / know routes | a self-contained section named in product vocabulary                                  |
| **pages**     | anything         | ✅                                       | used by **exactly one** page; the moment a second page needs it, it moves down a tier |

Examples of the rules in action:

- `ListingCard` is a **molecule** — it renders a `ListingSummary` and nothing else. It
  does **not** link anywhere; the results page wraps it in `<NuxtLink>`, because route
  awareness is an organism/page concern.
- `AppHeader`/`AppFooter` are **organisms**, not molecules — a site header/footer is a
  self-contained, product-vocabulary section of the interface (and `AppHeader` knows
  about routes via `<NuxtLink>`).
- `PropertyMap` is a **molecule**: it takes `coordinates` + `label` and draws a map. It's
  client-only by construction (Leaflet is `import()`ed inside `onMounted`), which also
  keeps it out of the listings-page bundle.

Nuxt names components by their folder path, so the tier is visible at the call site:
`components/atoms/Button/index.vue` → `<AtomsButton>`,
`components/organisms/AppHeader/index.vue` → `<OrganismsAppHeader>`. `components/pages/` is
registered as its own root so a page component reads as `<AboutIntro>`, not
`<PagesAboutIntro>` — the file tree already says it's a page component.

### Design system tokens

`src/assets/css/tokens/*.css` is the single source of truth for the visual language.
Tailwind v4 is CSS-first, so each token is a CSS custom property inside a `@theme` block,
and Tailwind generates the matching utilities automatically — `--color-brand-600` gives
`bg-brand-600`, `text-brand-600`, `ring-brand-600`, and so on. Components never use a raw
hex or pixel value; they only reach for tokens.

- **`colors.css`** — a custom `brand-*` ramp (50–900, the one accent colour); **semantic**
  surfaces (`surface`, `border`, `foreground`, `foreground-muted`, `on-brand`) that alias
  Tailwind's neutral scale so components ask for meaning, not a shade; status colours
  (`success` / `warning` / `danger` / `info`) aliased to Tailwind's built-in palette.
- **`spacing.css`** — `gutter` (mobile page-edge padding) and `section` (vertical rhythm),
  used as `px-gutter`, `py-section`.
- **`typography.css`** — base scale is Tailwind's default; adds `text-price` for the price.
- **`radius.css`** — `card` alias for the rounded corners used everywhere.
- **`shadows.css`** — `card` / `popover` elevation.

The same `main.css` is loaded by Storybook, so components look identical in both places.

**Mobile-first:** every class list is written unprefixed (the phone layout) first;
`sm:` / `md:` / `lg:` are added only where a wider viewport needs to differ.

### The server / API layer

The pages never call `partnerapi.funda.nl` directly — they can't, and shouldn't:

1. The Funda Partner API sends **no CORS headers**, so a browser request is blocked.
2. The API key must not reach the browser.

So two thin Nitro routes sit in between. A page calls `useFetch('/api/listings')` — its
own origin. During SSR that invokes the handler directly; on client-side navigation the
browser hits `/api/listings` same-origin (no CORS), and the route attaches the key
server-side (it lives in `runtimeConfig`, never `runtimeConfig.public`).

`server/utils/normalize.ts` turns Funda's raw feed — Dutch keys, HTML fragments in
values, `http://` image URLs, `"1963"` strings for numbers — into the clean
`#shared/types/listing` view models. Nothing raw crosses the server boundary.

---

## Notes & decisions

- **Plain `@storybook/vue3-vite`, not `@nuxtjs/storybook`** — the community module pins
  Storybook a major version behind. Nuxt's aliases and global atom registration are
  bridged into Storybook's Vite config manually instead.
- **Vue composition APIs are imported explicitly** (`import { computed } from 'vue'`) —
  valid in Nuxt, and it means components render the same in Storybook, which has no
  auto-import.
- **The `e2e` test paid for itself on the first run:** it caught that the detail
  response's `Id` is a numeric `GlobalId`; the UUID is in `InternalId`. The normaliser
  was reading the wrong field — a hand-written unit fixture would have hidden it.
- **Vitest is pinned to 4.x** — `@storybook/addon-vitest` and `@nuxt/test-utils` both
  need `^4`, while the Storybook CLI had installed `vitest@5`.

---

## What I'd do with more time

- **Caching** on the server routes (`defineCachedEventHandler`, short TTL + SWR) — Funda
  rate-limits aggressively.
- **Core Web Vitals**: eager + `fetchpriority="high"` on the first grid image,
  `preconnect` to the image CDN, `@nuxt/image` for responsive/modern-format images.
- A **fullscreen lightbox** for the gallery and an **accordion** for the feature groups
  (needs a headless UI lib — Reka UI).
- **Playwright E2E** for the page flows (list → detail → gallery → map); right now the
  `e2e` project only covers the API.
- A custom `error.vue` for the 404 / upstream-failure states.
- Search / filters / pagination — deliberately left out to keep the scope tight.

---

## Time spent

_<!-- fill in --> — spread over a few evenings._
