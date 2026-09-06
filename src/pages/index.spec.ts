import { setResponseStatus } from 'h3'
import type { H3Event } from 'h3'
import { beforeEach, describe, expect, it } from 'vitest'
import { registerEndpoint, renderSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtData } from '#app'
import { screen } from '@testing-library/vue'
import type { ListingSummary } from '#shared/types/listing'
import ListingPage from './index.vue'

const listing = (over: Partial<ListingSummary> = {}): ListingSummary => ({
  id: 'efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
  address: 'van Goghstraat 5',
  postcode: '5691DJ',
  city: 'Son en Breugel',
  price: 700000,
  priceLabel: '€ 700.000 k.k.',
  livingArea: 151,
  plotArea: 303,
  rooms: 5,
  listedSince: '4 maanden',
  agent: 'PAR-3 Makelaars',
  isSold: false,
  thumbnail: null,
  coordinates: null,
  has360Tour: false,
  hasVideo: false,
  hasFloorPlan: false,
  ...over,
})

let respond: (event: H3Event) => unknown

registerEndpoint('/api/listings', (event) => respond(event))

beforeEach(() => {
  // renderSuspended reuses one Nuxt app across tests, so useFetch would otherwise
  // serve the first test's cached payload to every later test
  clearNuxtData()
  respond = () => [
    listing(),
    listing({ id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', address: 'Kerkstraat 1' }),
  ]
})

describe('listings page', () => {
  it('renders a card per listing with the result count', async () => {
    await renderSuspended(ListingPage)

    expect(screen.getByRole('heading', { level: 1, name: 'Huizen te koop' })).toBeInTheDocument()
    expect(screen.getByText('2 woningen')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'van Goghstraat 5' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Kerkstraat 1' })).toBeInTheDocument()
  })

  it('links each card to its detail page', async () => {
    await renderSuspended(ListingPage)

    expect(screen.getByRole('link', { name: /van Goghstraat 5/ })).toHaveAttribute(
      'href',
      '/listings/efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
    )
  })

  it('shows the empty state when there are no listings', async () => {
    respond = () => []
    await renderSuspended(ListingPage)

    expect(screen.getByText(/geen woningen beschikbaar/i)).toBeInTheDocument()
  })

  it('shows the error state with a retry button when the API fails', async () => {
    respond = (event) => {
      setResponseStatus(event, 502)
      return { message: 'Funda API request failed' }
    }
    await renderSuspended(ListingPage)

    expect(screen.getByText(/kon het woningaanbod niet laden/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /opnieuw proberen/i })).toBeInTheDocument()
  })
})
