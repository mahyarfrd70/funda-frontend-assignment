import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import type { ListingSummary } from '#shared/types/listing'
import ListingCard from './index.vue'

const base: ListingSummary = {
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
  thumbnail: 'https://cloud.funda.nl/valentina_media/227/572/214_middel.jpg',
  coordinates: { lat: 51.51382, lng: 5.48473 },
  has360Tour: true,
  hasVideo: false,
  hasFloorPlan: true,
}

describe('ListingCard', () => {
  it('renders the price, address and location', async () => {
    await renderSuspended(ListingCard, { props: { listing: base } })

    expect(screen.getByText('€ 700.000 k.k.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'van Goghstraat 5' })).toBeInTheDocument()
    expect(screen.getByText('5691DJ Son en Breugel')).toBeInTheDocument()
  })

  it('renders the specs it has, and omits the ones it does not', async () => {
    await renderSuspended(ListingCard, {
      props: { listing: { ...base, plotArea: 0 } },
    })

    expect(screen.getByText(/5 kamers/)).toBeInTheDocument()
    expect(screen.getByText(/151 m² wonen/)).toBeInTheDocument()
    expect(screen.queryByText(/perceel/)).not.toBeInTheDocument()
  })

  it('shows a "Verkocht" badge only when the listing is sold', async () => {
    const { unmount } = await renderSuspended(ListingCard, { props: { listing: base } })
    expect(screen.queryByText('Verkocht')).not.toBeInTheDocument()
    unmount()

    await renderSuspended(ListingCard, { props: { listing: { ...base, isSold: true } } })
    expect(screen.getByText('Verkocht')).toBeInTheDocument()
  })

  it('shows only the feature badges present on the listing', async () => {
    await renderSuspended(ListingCard, { props: { listing: base } })

    expect(screen.getByText('360°')).toBeInTheDocument()
    expect(screen.getByText('Plattegrond')).toBeInTheDocument()
    expect(screen.queryByText('Video')).not.toBeInTheDocument()
  })

  it('falls back to a placeholder when there is no photo', async () => {
    await renderSuspended(ListingCard, {
      props: { listing: { ...base, thumbnail: null } },
    })

    expect(screen.getByText('Geen foto')).toBeInTheDocument()
  })
})
