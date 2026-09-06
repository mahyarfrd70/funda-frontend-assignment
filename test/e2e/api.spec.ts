import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
// relative, not `#shared/*` — the "e2e" project has no Nuxt aliases
import type { ListingDetail, ListingSummary } from '../../shared/types/listing'

describe('server API (e2e)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../..', import.meta.url)),
    dev: true,
  })

  it('GET /api/listings returns normalized summaries with no key or raw shapes leaked', async () => {
    const listings = await $fetch<ListingSummary[]>('/api/listings')

    expect(Array.isArray(listings)).toBe(true)
    expect(listings.length).toBeGreaterThan(0)
    expect(listings[0]).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      address: expect.any(String),
      priceLabel: expect.stringMatching(/€|aanvraag/),
      coordinates: expect.objectContaining({ lat: expect.any(Number), lng: expect.any(Number) }),
    })

    const payload = JSON.stringify(listings)
    expect(payload).not.toMatch(/[0-9a-f]{32}/) // no 32-hex API key anywhere
    expect(payload).not.toContain('"Objects"') // no raw Funda envelope
    expect(payload).not.toContain('http://') // images rewritten to https
  })

  it('GET /api/listings/:id returns the detail for a real listing', async () => {
    const listings = await $fetch<ListingSummary[]>('/api/listings')
    const detail = await $fetch<ListingDetail>(`/api/listings/${listings[0].id}`)

    expect(detail.id).toBe(listings[0].id)
    expect(Array.isArray(detail.photos)).toBe(true)
    expect(Array.isArray(detail.features)).toBe(true)
  })

  it('GET /api/listings/:id rejects a non-UUID id with 404', async () => {
    await expect($fetch('/api/listings/not-a-uuid')).rejects.toMatchObject({ status: 404 })
  })
})
