import { createError } from 'h3'
import type { H3Event } from 'h3'

/**
 * The one and only place the Funda API key is used.
 *
 * Key + base URL come from `runtimeConfig` (server-only — never in the
 * client bundle). `Accept: application/json` is mandatory: the feed
 * returns XML, or an error, without it (verified against the live
 * endpoint).
 *
 * Auto-imported by Nitro, so route handlers just call `fundaFetch(...)`.
 * The pure helpers below (`buildFundaUrl`, `mapFundaError`, `isListingId`)
 * are exported so they can be unit-tested without a running server.
 */

export interface FundaFetchOptions {
  /** Path segments *before* the key, e.g. `['detail']`. */
  prefix?: string[]
  /** Path segments *after* the key, e.g. `['koop', id]`. */
  suffix?: string[]
  query?: Record<string, string | number | undefined>
}

/** Funda listing IDs are UUIDs. Anything else gets a 200 + an XML error
 *  page from the feed (not a 404), so route handlers reject it up front. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isListingId(id: unknown): id is string {
  return typeof id === 'string' && UUID.test(id)
}

/** `{base}/{prefix?}/{key}/{suffix?}/` — the feed always wants the trailing slash. */
export function buildFundaUrl(base: string, key: string, opts: FundaFetchOptions = {}): string {
  const path = [...(opts.prefix ?? []), key, ...(opts.suffix ?? [])].join('/')
  return `${base}/${path}/`
}

/** Map an ofetch error to a client-facing H3 error (never leaks the upstream body). */
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
    // `as T` works around ofetch's TypedInternalResponse wrapper — the feed
    // is untyped upstream, so we assert the shape our callers pass in.
    return (await $fetch(buildFundaUrl(fundaApiBase, fundaApiKey, opts), {
      headers: { Accept: 'application/json' },
      query: opts.query,
    })) as T
  } catch (error) {
    throw mapFundaError(error)
  }
}
