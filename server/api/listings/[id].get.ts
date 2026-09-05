import type { RawDetail } from '../../utils/normalize'

// Funda listing IDs are UUIDs. Anything else gets a 200 + an XML error
// page from the feed (not a 404), so reject it here before wasting an
// upstream call — the detail page treats "malformed" and "gone" the same.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * GET /api/listings/:id
 *
 * Proxies Funda's "Listing Details" endpoint and returns a normalized
 * ListingDetail. A sold/removed listing (Funda responds 404) is passed
 * through as a 404 so the page can show a "no longer available" state.
 *
 * TODO: same caching note as listings.get.ts.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !UUID.test(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
  }

  const raw = await fundaFetch<RawDetail>(event, {
    prefix: ['detail'],
    suffix: ['koop', id],
  })

  return normalizeListingDetail(raw)
})
