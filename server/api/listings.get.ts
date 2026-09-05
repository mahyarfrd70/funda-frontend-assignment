import type { RawListingsResponse } from '../utils/normalize'

/**
 * GET /api/listings
 *
 * Proxies Funda's "Listings for Sale" feed (`type=koop`) and returns a
 * normalized ListingSummary[]. The API key never leaves the server.
 *
 * TODO: wrap in `defineCachedEventHandler` (short TTL + SWR) — Funda
 * rate-limits aggressively. Kept as a plain handler here so this first
 * version is trivial to verify; caching lands as its own change.
 */
export default defineEventHandler(async (event) => {
  const raw = await fundaFetch<RawListingsResponse>(event, {
    query: { type: 'koop' },
  })

  return normalizeListings(raw)
})
