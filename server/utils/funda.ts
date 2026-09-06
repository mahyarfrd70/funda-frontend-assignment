import { createError } from 'h3'
import type { H3Event } from 'h3'

export interface FundaFetchOptions {
  prefix?: string[]
  suffix?: string[]
  query?: Record<string, string | number | undefined>
}

// non-UUID ids get a 200 + XML error page from Funda, not a 404 — reject up front
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isListingId(id: unknown): id is string {
  return typeof id === 'string' && UUID.test(id)
}

export function buildFundaUrl(base: string, key: string, opts: FundaFetchOptions = {}): string {
  const path = [...(opts.prefix ?? []), key, ...(opts.suffix ?? [])].join('/')
  return `${base}/${path}/`
}

export function mapFundaError(error: unknown) {
  const status =
    typeof error === 'object' && error !== null && 'response' in error
      ? (error.response as { status?: number } | undefined)?.status
      : undefined

  if (status === 404) {
    return createError({ statusCode: 404, statusMessage: 'Listing not found' })
  }
  if (status === 429) {
    return createError({
      statusCode: 429,
      statusMessage: 'Funda API rate limit reached — try again shortly.',
    })
  }
  return createError({ statusCode: 502, statusMessage: 'Funda API request failed' })
}

export async function fundaFetch<T>(event: H3Event, opts: FundaFetchOptions = {}): Promise<T> {
  const { fundaApiKey, fundaApiBase } = useRuntimeConfig(event)

  if (!fundaApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Funda API key missing — set NUXT_FUNDA_API_KEY.',
    })
  }

  try {
    return (await $fetch(buildFundaUrl(fundaApiBase, fundaApiKey, opts), {
      headers: { Accept: 'application/json' }, // mandatory — the feed returns XML without it
      query: opts.query,
    })) as T
  } catch (error) {
    throw mapFundaError(error)
  }
}
