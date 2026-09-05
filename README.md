# Funda Frontend Assignment

Search + listing-detail mini-app built against Funda's Partner API, as a take-home
assignment. Stack: **Nuxt 4 · Vue 3 · TypeScript · Tailwind · Reka UI**.

> Status: work in progress, built step by step. This README grows with the project;
> sections for testing/deployment will fill in as those pieces land.

## Prerequisites

- Node 22 or 24 LTS
- pnpm (`corepack enable` or `brew install pnpm`)

## Setup

```bash
pnpm install
cp .env.example .env   # already contains the assignment's temporary API key
```

## Development

```bash
pnpm dev              # http://localhost:3000 (falls back to 3001+ if busy)
pnpm lint             # eslint
pnpm format           # prettier --write
pnpm typecheck        # vue-tsc via `nuxt typecheck`
pnpm storybook        # http://localhost:6006
pnpm build-storybook  # static build → storybook-static/
pnpm test             # unit/component tests, once
pnpm test:watch       # same, watch mode
pnpm coverage         # unit tests + coverage report
pnpm test:all         # unit tests + every story run as a Vitest browser test
```

## Storybook

Plain `@storybook/vue3-vite` (Storybook 10), **not** the `@nuxtjs/storybook` community
module — that module's latest release pins `storybook: ~9.0.5`, a major version behind.
Since atoms have no Nuxt-specific runtime dependency (no `useRoute`, no auto-imported
composables — just props, slots, and Tailwind classes), plain Vue3+Vite Storybook is the
correct fit; Nuxt-aware mocking (`<NuxtLink>` stubs, route mocks, etc.) can be added via
decorators if a later story needs it, without adopting the whole module.

- **Every component gets a `ComponentName.stories.ts`** next to its `index.vue`, e.g.
  `components/atoms/Button/Button.stories.ts`.
- **Tokens are shared, not duplicated**: `.storybook/preview.ts` imports the same
  `assets/css/main.css` the app uses, and `.storybook/main.ts` registers the same
  `@tailwindcss/vite` plugin — a component looks in Storybook exactly as it will in the
  app, no separate theme to keep in sync.
- **Bridging Nuxt's conveniences into Storybook** (Storybook's Vite build isn't Nuxt):
  `main.ts`'s `viteFinal` re-adds the `#shared/*` and `~/*` aliases; `preview.ts`
  `import.meta.glob`s the atoms and registers them globally, so a molecule's story can
  use `<AtomsBadge>` the way the app does. The one thing not bridged is Vue's
  auto-imported composition APIs — components `import { computed } from 'vue'`
  explicitly (valid in Nuxt too), so they render the same in both. `pnpm test:storybook`
  runs every story as a real browser test and would catch a regression here.
- **Mobile-first by default**: `preview.ts` sets the initial viewport to a phone
  (`iphone6`, 375px) — switch it from the toolbar to check `sm:`/`md:`/`lg:`.
- **a11y addon** runs automatically on every story (panel shows violations; not yet
  wired to fail CI — see `parameters.a11y.test` in `preview.ts`).
- **`@storybook/addon-vitest`** lets every story double as a Vitest test
  (`vitest.config.ts` already wires it up) — real component test coverage without a
  separate Testing Library setup, covered further in a later testing step.

**Known gotcha (fixed, documented so it doesn't get "fixed" again by accident):** Vite 8
made Rolldown its default production bundler. `@storybook/vue3-vite`'s static build
(`storybook build`) failed with a raw `<script setup>` block reaching the JS/TS parser
un-transformed — Rolldown's build path wasn't invoking the Vue SFC plugin already
present transitively. Fixed by registering `@vitejs/plugin-vue` explicitly (and as a
direct devDependency, since Node's ESM resolution from `.storybook/main.ts` needs it
declared directly, not just transitively available) in `viteFinal`. `pnpm dev` was never
affected — only the static build path. Confirmed fixed by actually running
`pnpm build-storybook` and inspecting the compiled CSS for real token output, not just
by the build exiting 0.

## Testing

**Every component gets a `ComponentName.spec.ts`** next to its `index.vue` — same
per-component folder as its story, e.g. `components/atoms/Button/Button.spec.ts`.

- **`@vue/test-utils` + `@testing-library/vue`**, via **`@nuxt/test-utils`**'s
  `renderSuspended` — this runs the component inside a real (headless) Nuxt context, so
  Nuxt auto-imports (`<AtomsBadge>`, `<AtomsButton>`, `<NuxtLink>`, composables) all
  resolve exactly like they do in the app. No manual mocking/registration needed for
  components that just consume other auto-imported components.
- Queries follow Testing Library convention — `screen.getByRole(...)`,
  `screen.getByText(...)` — asserting on what a user/assistive tech would perceive
  (accessible name, role, visible text), not implementation details. Pairs naturally
  with the a11y addon already running in Storybook.
- `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`,
  `toBeDisabled`, ...) are registered at runtime in `test/vitest-setup.ts`. The **types**
  for those matchers come from a second, separate import in root-level
  `testing-library.d.ts` — Nuxt's generated tsconfig only auto-includes root `*.d.ts`
  files (and `test/nuxt/**`), not the `test/` folder itself, so the runtime setup file
  alone isn't visible to `pnpm typecheck` / the editor's TS server. Two files, one
  reason: confirmed by reading `.nuxt/tsconfig.app.json`'s actual `include` glob rather
  than guessing why `toBeInTheDocument` was untyped.
- Two Vitest **projects** run side by side (`vitest.config.ts`): `unit` (our
  `*.spec.ts`, fast, jsdom-like) and `storybook` (every `*.stories.ts` executed as a
  real browser test via Playwright — interaction coverage for free from stories
  already written). `pnpm test` runs only `unit` (the fast, everyday command);
  `pnpm test:all` runs both.

**A real dependency conflict, resolved by checking, not guessing:** the Storybook CLI's
init pinned `vitest@5.0.0` (needed by `@vitest/coverage-v8@5.0.0`), but
`@storybook/addon-vitest@10.6.0` declares `vitest: ^3.0.0 || ^4.0.0`, and
`@nuxt/test-utils@4.2.0` declares `vitest: ^4.0.2` — both incompatible with 5.x. Caught
this with `pnpm peers check` (not by hitting a runtime error later) and realigned the
whole vitest family to the latest **4.x** line (`vitest@4.1.11` +
`@vitest/coverage-v8@4.1.11` + `@vitest/browser-playwright@4.1.11`), which satisfies
every one of those ranges at once — confirmed clean with `pnpm peers check` afterward.

**Coverage gotcha:** `@vitest/coverage-v8` didn't attribute lines to tested `.vue`
files at all until `vitest.config.ts` declared an explicit
`coverage.include: ['src/**/*.vue', 'src/**/*.ts']` — without it, the report silently
only covered plain `.ts`/untested files. Verified by checking the report actually names
the tested components (95% coverage across them) rather than trusting a report that
merely printed a summary.

**Documented, not yet done:** `layouts/default.vue` has no test yet (trivial wrapper,
lowest priority); MSW-backed integration tests for the `server/api/*` routes (which now
exist — see the Server API section) plus adding `server/**` to `coverage.include`;
Playwright E2E once the real Search/Detail pages exist.

## Git hooks

[Husky](https://typicode.github.io/husky/) enforces the same checks locally that would
otherwise only be caught in CI — `pnpm install` wires them up automatically via the
`prepare` script, nothing to run manually after cloning.

- **`pre-commit`** — `pnpm lint && pnpm typecheck && pnpm test`. Fails (blocking the
  commit) on the first failing step, since the hook script starts with `set -e`.
- **`pre-push`** — `pnpm coverage`, which fails if statements/branches/functions/lines
  drop below **75%**. The threshold is enforced by Vitest itself
  (`vitest.config.ts` → `test.coverage.thresholds`), not a custom parsing script.
  Coverage uses `all: true` — every file matched by `coverage.include` counts, even
  ones no test happens to import — otherwise an untested file would simply be absent
  from the report instead of dragging the score down, and the gate would be
  decorative. Verified this is a real gate, not just a report: temporarily set
  `thresholds.lines` to `100` and confirmed `pnpm coverage` actually exits non-zero
  before reverting it.

Both hooks were verified by invoking them directly (`sh .husky/pre-commit`) rather than
via a real commit, and by confirming `git config core.hooksPath` actually points at
`.husky/_` — proof Git will invoke them, not just that the scripts run in isolation.

## Project structure

```
src/                            # Nuxt's srcDir — all application code lives here
  components/
    atoms/                      # Button, Badge, Input, Icon, Spinner...
    molecules/                  # pure presentation, no routing/data — each with .spec + .stories
      ListingCard/               #   one result in the grid
      PhotoGallery/              #   main photo + thumbnail strip, local `current` state
      KeyFacts/                  #   the facts grid on the detail page
      FeatureGroups/             #   Funda's grouped "Kenmerken" as titled lists
      PropertyMap/               #   Leaflet + OSM map, client-only (dynamic import in onMounted)
    organisms/
      AppHeader/index.vue        # self-contained, product-vocabulary sections —
      AppFooter/index.vue        # know about routes, may fetch data
    pages/
      about/Intro/index.vue      # used by exactly one page, never shared
  composables/                  # Vue composables (stateful/reactive logic) — the Vue
                                # equivalent of React hooks. Auto-imported by Nuxt.
  utils/                        # pure, framework-agnostic functions (formatting,
                                # parsing, URL helpers). No Vue, no HTTP calls.
  pages/                        # routes — thin, compose components/{atoms,molecules,...}/*
    index.vue                   # listing results — useFetch('/api/listings'), SSR
    listings/[id].vue           # listing detail — useFetch('/api/listings/:id'), SSR;
                                # 404 (sold/removed) re-thrown as a fatal error
  layouts/                      # Nuxt page layouts (<NuxtLayout>), e.g. default.vue
  assets/css/                   # Tailwind entry + design tokens (tokens/*.css)
  app.vue                       # root component — <NuxtLayout><NuxtPage /></NuxtLayout>
server/                         # Nitro backend — separate runtime, not affected by srcDir
  api/
    listings.get.ts             # GET /api/listings   — proxies Funda's koop feed
    listings/[id].get.ts        # GET /api/listings/:id — proxies Funda's detail endpoint
  utils/
    funda.ts                    # the single place the API key is used (auto-imported)
    normalize.ts                # raw Funda payload → clean view models (auto-imported)
shared/
  types/listing.ts              # the normalized types, imported by both server/ and pages
public/                         # static files served as-is
```

**Atomic Design, four tiers, each with hard rules — not just a naming convention:**

1. **`atoms/`** — the smallest useful piece; can't be broken down further without
   losing meaning (Button, Input, Icon, Spinner). Imports nothing from any other
   component tier — zero dependencies. No data fetching, no store access, no
   `useRoute`. Everything in through props, everything out through emits. Must be
   renderable with no context whatsoever.
2. **`molecules/`** — a small group of atoms doing one job together (a form field:
   label + input + error text; a search bar: input + button). May import atoms, may
   **not** import organisms. Still no data layer. Presentation logic only — showing an
   error state, formatting a display string.
3. **`organisms/`** — a self-contained section of the interface that means something
   in _this_ product (a site header, a listing grid, a checkout form) — named in
   business vocabulary, not generic UI vocabulary. This is where the rules loosen and
   the domain arrives: organisms **may** import molecules and atoms, **may** fetch
   data, read stores, and know about routes. `AppHeader`/`AppFooter` live here, not in
   `molecules/`, specifically _because_ they use `<NuxtLink>` — route awareness is an
   organism-tier capability, not a molecule one.
4. **`pages/`** — components that may use atoms, molecules, and organisms freely, but
   are used by **exactly one page**. If a second page ever needs one, promote it out
   of `pages/` into `molecules/` or `organisms/` (whichever tier its own rules match)
   — the folder name is the enforcement mechanism: nothing outside that one page
   should ever import from here.

All four are just subfolders of `components/`, so Nuxt's default recursive scan covers
every tier with zero extra config.

**Why `pages/` components don't live physically inside the route folder `src/pages/`:**
in Nuxt, _every_ `.vue` file under `src/pages/` becomes a route automatically,
recursively, based on its file path — unlike Next.js, where only `page.tsx` is special
and anything else can be freely colocated. So a component at `src/pages/about/Hero.vue`
would silently register as the route `/about/hero`. `components/pages/` gets the same
"only used by this one page" intent without that routing risk — and reads clearly next
to the other three tiers.

**`utils/` vs `composables/`:** if it uses `ref`/`watch`/lifecycle hooks or returns
reactive state, it's a composable. If it's a plain function with no Vue dependency
(e.g. `formatPrice`, `parseDotNetDate`), it's a util. One rule, no ambiguity — and both
directories are auto-imported by Nuxt, so there's never a manual `import` to write for
either.

**File convention — every component gets its own folder:** `Button.vue` lives at
`atoms/Button/index.vue`, not `atoms/Button.vue`, with its story and spec alongside it
(`Button.stories.ts`, `Button.spec.ts`). This gives each component a home for
everything that belongs to it without cluttering the parent folder.

**Component tag names — two different rules, by design (`nuxt.config.ts`):**
`atoms/`, `molecules/`, `organisms/` are scanned from the shared `~/components` root, so
the tier name stays as a prefix: `components/atoms/Button/index.vue` → `<AtomsButton>`,
`components/organisms/AppHeader/index.vue` → `<OrganismsAppHeader>`. `pages/` is
registered as its **own separate root** (`~/components/pages`, excluded from the first
root via `ignore: ['pages/**']` so it isn't scanned twice) — that root's own name never
becomes part of the tag, but the page-name folder underneath it still does:
`components/pages/about/Intro/index.vue` → `<AboutIntro>`, not `<PagesAboutIntro>`.
Deliberate: organisms/atoms/molecules read better with their tier visible at the call
site, while a page component's tag reads more naturally as "which page" than "that it's
a page component" (self-evident from `pages/about/` in the file tree either way).

**Gotcha with `index.vue` + dedup:** for a plain filename, Nuxt drops a folder-name
prefix that the filename already repeats — `components/organisms/ListingCard.vue`
would resolve to `<ListingCard>` if the folder were `listing/`. With `index.vue` there's
no filename left to compare against, so that dedup never fires — every path segment
concatenates in full, regardless of repetition. This bit us for real: the about page's
component was first named `pageComponents/about/AboutIntro/index.vue`, which should have
produced `<AboutIntro>` but instead silently became `<AboutAboutIntro>` and failed to
resolve entirely (caught by actually booting the page, not by reasoning about it). Fixed
by naming the component folder for its _role_, not by repeating an ancestor folder's
name — `Intro`, not `AboutIntro`, since `pages/about/` already supplies that context.

## Server API

The Vue pages never call `partnerapi.funda.nl` directly. They can't: the Funda Partner
API sends **no CORS headers** (verified by calling it), so a browser request is blocked
outright — and the API key must not reach the browser anyway. Two thin Nitro routes sit
in between:

| Route                   | Proxies                                 | Returns            |
| ----------------------- | --------------------------------------- | ------------------ |
| `GET /api/listings`     | Funda "Listings for Sale" (`type=koop`) | `ListingSummary[]` |
| `GET /api/listings/:id` | Funda "Listing Details"                 | `ListingDetail`    |

The feed returns ~15 listings for a bare `type=koop` query — no pagination, kept
deliberately simple. (Pagination / infinite scroll would be a documented "further
improvement".)

A page calls `useFetch('/api/listings')` — its **own** origin. During SSR that invokes
the handler directly (no network hop); on client-side navigation the browser hits
`/api/listings` same-origin (no CORS), and the route attaches the key server-side. The
key lives in exactly one file, `server/utils/funda.ts`, read from `runtimeConfig` —
never in a route handler's own code, never in the client bundle.

**Raw → clean:** the feed is Dutch-keyed, dates arrive as `"/Date(...)/"` strings,
feature values contain HTML fragments, and image URLs are `http://`. `server/utils/
normalize.ts` maps all of that into the `#shared/types/listing` view models before it
leaves the server — the client never sees a raw Funda shape. Notable transforms:
`http://` → `https://` on every image (mixed-content would break them on an https
deploy), CDN size-suffix swaps (`_klein` → `_middel`/`_groot`), price → `"€ 700.000
k.k."`, `WGS84_X/Y` → `{ lat, lng }`, HTML stripped from `Kenmerken` values.

**Error mapping:** upstream 404 → 404 (a sold/removed listing — the detail page can show
"no longer available"); a non-UUID `:id` is rejected as 404 before any upstream call
(Funda answers those with a `200` + XML error page, not a 404); rate limit → 429;
anything else upstream → 502. Verified each path against the live API.

**Not done yet:** no caching (Funda rate-limits hard — `defineCachedEventHandler` with a
short TTL + SWR is the next change, kept separate so its own behavior gets verified); no
integration tests yet (`server/**` isn't in `coverage.include` either — both land
together, with MSW mocking the feed).

## Pages

Both pages `await useFetch('/api/…')` — SSR-rendered, the Funda key never in the browser,
the LCP image (`fetchpriority="high"`) already in the initial HTML.

- **`/` — listing results.** Grid of `<NuxtLink><MoleculesListingCard></NuxtLink>`.
  Loading skeleton, error + retry, empty state.
- **`/listings/[id]` — listing detail.** Photo gallery, key-facts grid, description,
  grouped features, and the location map. A sold/removed listing (upstream 404) is
  re-thrown as a fatal `createError` so Nuxt serves a real 404, not a 200 with an empty
  page.

**The map** is Leaflet + OpenStreetMap tiles — no API key, no signup. Zoom in/out
(buttons, scroll wheel, pinch) are Leaflet defaults. It's client-only by construction:
Leaflet touches `window`, so it's `import()`ed inside `onMounted` (which also keeps it
out of the listings-page bundle — verified), and the page wraps it in `<ClientOnly>` with
a same-height fallback so the map appearing causes no layout shift. An unmount guard
after the dynamic import stops `L.map(null)` throwing on fast navigation — a real bug the
Storybook browser test caught.

**Documented, not done:** a fullscreen lightbox for the gallery; an accordion for the
feature groups (needs a headless UI lib); a sticky mobile price/CTA bar; the Core Web
Vitals work from the analysis (eager LCP image on the grid, `preconnect` to the image
CDN, response caching).

## Design tokens

`assets/css/tokens/*.css` is the single source of truth for the design system — one file
per concern (`colors.css`, `spacing.css`, `typography.css`, `radius.css`, `shadows.css`),
all imported by `assets/css/main.css`. Tailwind v4 is CSS-first, so there's no
`tailwind.config.js` object to keep in sync: every `--color-*` / `--spacing-*` custom
property inside a file's `@theme` block becomes matching utility classes automatically
(`--color-brand-600` → `bg-brand-600`, `text-brand-600`, `ring-brand-600`, ...) —
components should never reach for a raw hex/px value, only these tokens. Highlights:

- **`colors.css`** — a custom 50–900 `brand-*` orange ramp (the app's one accent);
  semantic surfaces (`surface`, `border`, `foreground`, `foreground-muted`, `on-brand`)
  aliasing Tailwind's built-in neutral scale so components reach for meaning
  ("foreground") rather than a raw shade ("neutral-900"); status colors (`success` /
  `warning` / `danger` / `info`) aliased to Tailwind's existing emerald/amber/red/blue.
- **`spacing.css`** — `gutter` (mobile page-edge padding) and `section` (vertical
  rhythm) as semantic spacing tokens, used as `px-gutter`, `py-section`, etc.
- **`typography.css`** — base type scale is Tailwind's default (already systemic);
  this file only adds app-specific sizes, e.g. `text-price` for listing prices.
- **`radius.css`** — `card` alias for the rounded corners used on every card/panel.
- **`shadows.css`** — `card` / `popover` elevation.

**Mobile-first convention:** every class list is written unprefixed (mobile) first;
`sm:`/`md:`/`lg:` are added only where a larger viewport needs to look different — see
`components/organisms/AppHeader/index.vue` or `pages/index.vue` for the pattern in
practice.

## Deployment

**Chosen path: Vercel, running the Docker image directly** — Vercel added first-class
support for this in June 2026 ([Container Images](https://vercel.com/docs/functions/container-images)):
a `Dockerfile.vercel` (or `Containerfile.vercel`) at the repo root is auto-detected and
run as a container-backed Vercel Function on Fluid compute, instead of Vercel's normal
framework build pipeline. This is a different mechanism from a plain `Dockerfile` — see
below for why there are two.

`.github/workflows/deploy.yml` runs on every push/PR (`quality`: lint, typecheck,
coverage — the same three gates as the local pre-commit/pre-push hooks, so a bypassed
local hook still can't reach production) and, only on a push to `main`, deploys via the
Vercel CLI:

```bash
vercel deploy --prod --yes \
  --env NUXT_FUNDA_API_KEY="$NUXT_FUNDA_API_KEY" \
  --env NUXT_FUNDA_API_BASE="https://partnerapi.funda.nl/feeds/Aanbod.svc/json"
```

**Required GitHub repo secrets** (Settings → Secrets and variables → Actions):

| Secret                               | Where to get it                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`                       | Vercel dashboard → Account Settings → Tokens → Create                                                                                             |
| `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Run `vercel link` locally once — writes `.vercel/project.json` with both (gitignored; CI doesn't need the file, just these two values as secrets) |
| `NUXT_FUNDA_API_KEY`                 | The assignment's API key (or a real one later)                                                                                                    |

**How the key stays out of the repo and out of the browser:**

- _Repo:_ `--env` reads `${{ secrets.NUXT_FUNDA_API_KEY }}` at deploy time only — GitHub
  Actions redacts the value from all logs automatically, and it's never written to a
  file that gets committed. `.env` itself stays local-only (gitignored) and is never
  read by CI at all.
- _Browser:_ this was already true before Docker/Vercel entered the picture — the key
  lives in `runtimeConfig.fundaApiKey` (`nuxt.config.ts`), not `runtimeConfig.public`,
  so Nuxt never serializes it into the client bundle or hydration payload. Deployment
  mechanism doesn't change this; it's a property of how the app reads the key.

**Two Dockerfiles, two different jobs:**

- **`Dockerfile.vercel`** — required filename for Vercel's container-Function path
  above; leaves `PORT` unset so Vercel can inject its own (default 80) rather than
  fighting a hardcoded one.
- **`Dockerfile`** — generic, for any platform that runs a container image directly
  (Fly.io, Railway, Render, Cloud Run, a VPS) — fixes `PORT=3000` since there, we're the
  ones deciding it. Not used by the Vercel path, kept for that alternative.

```bash
pnpm docker:build   # docker build -t funda-frontend-assignment .
pnpm docker:run     # docker run --rm -p 3000:3000 --env-file .env funda-frontend-assignment
# or, equivalently:
docker compose up --build
```

**Three stages, final image ships only `.output/`:**

1. `deps` — `pnpm install --frozen-lockfile`, cached independently of source changes
   (`--ignore-scripts`, since `nuxt.config.ts` isn't in this stage yet for the
   `postinstall: nuxt prepare` hook to run against).
2. `build` — full source copied in, `pnpm build` produces `.output/`.
3. `runtime` — copies **only** `.output/` into a fresh `node:24-alpine`. No pnpm, no
   source, no dev dependencies in the final image.

That last point isn't an assumption — verified directly by running `pnpm build`,
inspecting the result, and running the server standalone before writing the Dockerfile
around it: Nitro's `node-server` preset (Nuxt's default) copies every runtime dependency
it needs into `.output/server/node_modules` itself. The whole `.output/` folder for this
app is ~2.7 MB, and `node .output/server/index.mjs` runs correctly with nothing else
present, respecting `PORT`/`HOST` env vars (confirmed by actually starting it on a
non-default port and curling it).

**What's genuinely unverified:** this environment has neither Docker/Podman/Colima nor a
Vercel account connected, so none of `docker build`, `docker run`, or an actual
`vercel deploy` have been executed — only the Node-level behavior both Dockerfiles
depend on has been (see above), plus reading Vercel's current official docs directly
(fetched, not recalled from training data, since this container-Functions feature
shipped after that cutoff) for the `Dockerfile.vercel` filename requirement, the `--env`
flag's runtime-injection behavior, and the `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` env-var
convention. Once the three `VERCEL_*` secrets are set, push to `main` and check the
Action run and the deployment URL; report back anything that doesn't match.

**Secrets:** `.env` is never copied into the image (`.dockerignore` excludes it) — pass
`NUXT_FUNDA_API_KEY`/`NUXT_FUNDA_API_BASE` at `docker run`/`docker compose` time via
`--env-file` (as the scripts above do) or your host's own secret/env mechanism.
