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
 */

export interface FundaFetchOptions {
  /** Path segments *before* the key, e.g. `['detail']`. */
  prefix?: string[]
  /** Path segments *after* the key, e.g. `['koop', id]`. */
  suffix?: string[]
  query?: Record<string, string | number | undefined>
}

export async function fundaFetch<T>(event: H3Event, opts: FundaFetchOptions = {}): Promise<T> {
  const { fundaApiKey, fundaApiBase } = useRuntimeConfig(event)

  if (!fundaApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Funda API key missing — set NUXT_FUNDA_API_KEY.',
    })
  }

  const path = [...(opts.prefix ?? []), fundaApiKey, ...(opts.suffix ?? [])].join('/')

  try {
    // Funda's feed always wants a trailing slash before the query string.
    // The `as T` works around ofetch's TypedInternalResponse wrapper — the
    // feed is untyped upstream, so we assert the shape our callers pass in.
    return (await $fetch(`${fundaApiBase}/${path}/`, {
      headers: { Accept: 'application/json' },
      query: opts.query,
    })) as T
  } catch (error) {
    throw mapUpstreamError(error)
  }
}

function mapUpstreamError(error: unknown) {
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
