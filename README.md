# Funda — Frontend Assignment

A two-page property app on Funda's Partner API: a **listing results** page and a
**listing detail** page with a photo gallery, key facts, and an interactive map.
Mobile-first, server-rendered with Nuxt 4, and the API key never reaches the browser.

**Live:** https://funda-frontend-assignment.vercel.app/

**Built with:** Nuxt 4 (Vue 3.5, Nitro) · TypeScript (strict) · Tailwind CSS v4
(CSS-first design tokens) · Leaflet + OpenStreetMap · Vitest · Storybook · Playwright ·
ESLint / Prettier / Husky · deployed to Vercel as a container.

---

## Issues faced & decisions made
#### Security — keep the API key off the client

The brief ships an API key, and it must not appear in the browser **or** in the repo. So
the pages never call Funda directly: two thin **Nitro API routes** (`server/api/listings*`)
proxy the feed and read the key from the `NUXT_FUNDA_API_KEY` **environment variable** via
`runtimeConfig` (server-only, never `runtimeConfig.public`). A page just does
`useFetch('/api/listings')` — same origin, key attached server-side.

For deployment I added a **GitHub Actions** workflow that builds and ships the app to
Vercel and injects the key from a **repository secret** on the production environment — so
the key is never committed and never sent to the client.

### UX — the property's map / floor-plan images were being cropped

The detail-page gallery used `object-cover`, which fills the frame and clips the edges.
That's fine for photos, but several images are the **plattegrond / location map**, where
the cropped-off edges are exactly what the user needs to see. This felt like a real UX
problem, so I switched the main gallery image from **`object-cover` to `object-contain`**:
every image is now shown in full, letterboxed against a neutral background, with a fixed
frame height so there's no layout shift.

#### Before Fix
<img width="1106" height="935" alt="Screenshot 2026-09-06 at 13 11 09" src="https://github.com/user-attachments/assets/ab2a9a1f-d121-4412-9ce4-b1747aab2527" />

#### After Fix
<img width="1058" height="896" alt="Screenshot 2026-09-06 at 13 11 37" src="https://github.com/user-attachments/assets/10c90f3b-7134-4d6a-8f85-0d1e279d8f29" />


### Performance — the gallery downloaded full-size images on load

Every gallery image was loaded at `_groot` (large) size as soon as a detail page opened,
so the browser pulled megabytes of images before the visitor did anything. Funda serves
`_klein` / `_middel` / `_groot` variants, so the server now returns each photo as
`{ thumb: _klein, full: _groot }`: the **thumbnail strip loads only the small files**, and
a **large image is fetched only when the visitor opens that photo**. The results grid uses
`_middel` for the same reason.

---

## Getting started

```bash
pnpm install                 # also runs `nuxt prepare` and wires up the git hooks

cp .env.example .env         # then set NUXT_FUNDA_API_KEY to the key from the brief
pnpm dev                     # → http://localhost:3000
```

Production build:

```bash
pnpm build                   # → .output/  (self-contained Nitro server)
pnpm preview                 # serve that build locally
```

Requires **Node 22 or 24 LTS** and **pnpm**.

---

## Commands

| Command                                        | What it does                                   |
| ---------------------------------------------- | ---------------------------------------------- |
| `pnpm dev`                                     | dev server, http://localhost:3000              |
| `pnpm build` / `pnpm preview`                  | production build / serve it locally            |
| `pnpm lint` · `pnpm format` · `pnpm typecheck` | ESLint · Prettier · `vue-tsc`                  |
| `pnpm test`                                    | unit + component + page-integration tests      |
| `pnpm test:all`                                | unit + Storybook                               |
| `pnpm coverage`                                | unit tests + coverage report (fails under 75%) |
| `pnpm storybook` / `pnpm build-storybook`      | component workshop                             |
| `pnpm test:api:e2e`                            | hit `/api/*` against the live Funda API        |
| `pnpm test:web:e2e`                            | Playwright — both pages in a real browser      |
| `pnpm docker:build` / `pnpm docker:run`        | build / run the container image                |

---

## Project structure

```
src/
  assets/css/
    main.css              Tailwind + the token files
    tokens/               design system — one @theme file per concern
  components/
    atoms/                Button, Badge
    molecules/            ListingCard, PhotoGallery, KeyFacts, FeatureGroups, PropertyMap
    organisms/            AppHeader, AppFooter
    pages/                markup lifted out of one route
      listing-results/      Grid, Skeleton, ErrorState
      listing-detail/       Header, Section, Description, Location
  layouts/default.vue    header + <slot> + footer
  pages/
    index.vue            listing results  — useFetch('/api/listings')
    listings/[id].vue    listing detail   — useFetch('/api/listings/:id')

server/                  Nitro — the proxy layer
  api/listings*.ts       the routes the pages call
  utils/funda.ts         the one place the API key is read
  utils/normalize.ts     raw Funda payload → clean #shared/types view models

shared/types/listing.ts  the normalized types, shared by server/ and pages
e2e/                     api/  — API contract tests   ·   web/  — Playwright
```

- **Components** are tiered atoms → molecules → organisms → pages, each in its own folder
  as `ComponentName/index.vue` with a `*.spec.ts` alongside (and a `*.stories.ts` for the
  reusable tiers). Nuxt names them by path, so the tier is visible at the call site
  (`<AtomsButton>`, `<ListingDetailHeader>`).
- **Route files stay thin** — they own the data (`useFetch`, the error guard, SEO meta)
  and the top-level state branching; every block of markup is a `components/pages/*`
  component.
- **Design tokens** live in `src/assets/css/tokens/*.css` as Tailwind v4 `@theme` custom
  properties. Components only use the generated utilities (`bg-brand-600`, `px-gutter`,
  `text-price`), never raw hex or pixel values.
- **Mobile-first** — class lists are the phone layout unprefixed; `sm:` / `md:` / `lg:` are
  added only where a wider viewport needs to differ.

---

## Testing

| Layer                   | Tool                                          | Covers                                                                                                                                      |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| unit / component / page | Vitest + `@nuxt/test-utils` + Testing Library | components and pages rendered in a real Nuxt context; page specs mock the Nitro endpoints and assert the happy / empty / error / 404 states |
| component variants      | Storybook, run as browser tests               | every `*.stories.ts` executed in a real browser                                                                                             |
| API contract            | Vitest (`e2e/api`)                            | boots Nuxt and calls `/api/*` against the **live** feed — no key leaked, no raw shapes                                                      |
| end-to-end              | Playwright (`e2e/web`)                        | a real browser through both pages against the live API — SSR'd HTML, list → detail, gallery, map, back link, 404; desktop **and** mobile    |

```bash
pnpm test          # everyday: fast unit tests
pnpm test:all      # unit + storybook
pnpm coverage      # + coverage, 75% gate
pnpm test:api:e2e  # live API contract          (needs the key)
pnpm test:web:e2e  # Playwright, real browser   (needs the key + `pnpm exec playwright install chromium`)
```

CI (`.github/workflows/deploy.yml`) runs **lint + typecheck + coverage** on every push,
then deploys `main` to Vercel.

---

## What I'd do with more time

- **Pagination on the results page.** Every listing renders at once. The feed only returns
  ~15 items so it isn't a real problem here, but a longer list would need paging (or
  windowing) to keep the initial render cheap — I skipped it to keep the scope tight.
- **Playwright in CI.** The e2e suite is opt-in today because it needs the API key and
  hits the live feed. I'd wire it into the workflow behind the existing secret, plus a
  mocked-API variant so it can also run without the feed.

---

## Time spent

I spent about 8 hours on it (1 working day)
