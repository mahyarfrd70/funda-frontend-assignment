import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
// Relative (not `#shared/*`) — the "e2e" Vitest project runs in a plain node
// environment without the Nuxt aliases.
import type { ListingDetail, ListingSummary } from '../../shared/types/listing'

/**
 * End-to-end: spins up the real Nuxt server and exercises the Nitro routes
 * against the live Funda Partner API. Opt-in via `pnpm test:e2e` — it's slow
 * and needs network. Proves the route composition (param check → fundaFetch
 * → normalize) works as a whole, not just the unit-tested pieces.
 */
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
