import type { RawDetail } from '../../utils/normalize'

/**
 * GET /api/listings/:id
 *
 * Proxies Funda's "Listing Details" endpoint and returns a normalized
 * ListingDetail. A sold/removed listing (Funda responds 404) is passed
 * through as a 404 so the page can show a "no longer available" state; a
 * non-UUID id is rejected up front (Funda answers those with a 200 + XML
 * error page, not a 404).
 *
 * TODO: same caching note as listings.get.ts.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!isListingId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
  }

  const raw = await fundaFetch<RawDetail>(event, {
    prefix: ['detail'],
    suffix: ['koop', id],
  })

  return normalizeListingDetail(raw)
})
