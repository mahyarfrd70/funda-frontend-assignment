import type { RawDetail } from '../../utils/normalize'

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
