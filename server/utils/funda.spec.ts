import { describe, expect, it } from 'vitest'
import { buildFundaUrl, isListingId, mapFundaError } from './funda'

const BASE = 'https://partnerapi.funda.nl/feeds/Aanbod.svc/json'
const KEY = '76666a29898f491480386d966b75f949'

describe('isListingId', () => {
  it('accepts a UUID', () => {
    expect(isListingId('efc3296e-c7cd-462f-ba9d-d6e04da0ebbf')).toBe(true)
  })

  it('rejects anything that is not a UUID', () => {
    expect(isListingId('not-a-uuid')).toBe(false)
    expect(isListingId('12345')).toBe(false)
    expect(isListingId('')).toBe(false)
    expect(isListingId(undefined)).toBe(false)
    expect(isListingId(42)).toBe(false)
  })
})

describe('buildFundaUrl', () => {
  it('builds the listings URL: {base}/{key}/', () => {
    expect(buildFundaUrl(BASE, KEY)).toBe(`${BASE}/${KEY}/`)
  })

  it('places prefix segments before the key and suffix segments after it', () => {
    expect(buildFundaUrl(BASE, KEY, { prefix: ['detail'], suffix: ['koop', 'abc-123'] })).toBe(
      `${BASE}/detail/${KEY}/koop/abc-123/`,
    )
  })
})

describe('mapFundaError', () => {
  const upstream = (status: number) => ({ response: { status } })

  it('maps a 404 to a 404 "Listing not found"', () => {
    const err = mapFundaError(upstream(404))
    expect(err.statusCode).toBe(404)
    expect(err.statusMessage).toBe('Listing not found')
  })

  it('maps a 429 to a 429 rate-limit error', () => {
    expect(mapFundaError(upstream(429)).statusCode).toBe(429)
  })

  it('maps any other upstream failure to a 502', () => {
    expect(mapFundaError(upstream(500)).statusCode).toBe(502)
    expect(mapFundaError(new Error('network down')).statusCode).toBe(502)
    expect(mapFundaError('boom').statusCode).toBe(502)
  })

  it('never carries the upstream response body through', () => {
    const err = mapFundaError({ response: { status: 500, _data: 'secret internals' } })
    expect(JSON.stringify(err)).not.toContain('secret internals')
  })
})
