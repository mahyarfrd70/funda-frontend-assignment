import type { RawListingsResponse } from '../utils/normalize'

export default defineEventHandler(async (event) => {
  const raw = await fundaFetch<RawListingsResponse>(event, {
    query: { type: 'koop' },
  })

  return normalizeListings(raw)
})
