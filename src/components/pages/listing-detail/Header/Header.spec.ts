import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import type { ListingDetail } from '#shared/types/listing'
import Header from './index.vue'

const listing = (over: Partial<ListingDetail> = {}): ListingDetail => ({
  id: 'x',
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
  description: '',
  yearBuilt: 1963,
  bedrooms: 3,
  bathrooms: 1,
  energyLabel: 'C',
  photos: [],
  features: [],
  ...over,
})

describe('ListingDetailHeader', () => {
  it('renders the price, address and location as the page title block', async () => {
    await renderSuspended(Header, { props: { listing: listing() } })

    expect(screen.getByRole('heading', { level: 1, name: 'van Goghstraat 5' })).toBeInTheDocument()
    expect(screen.getByText('€ 700.000 k.k.')).toBeInTheDocument()
    expect(screen.getByText('5691DJ Son en Breugel')).toBeInTheDocument()
    expect(screen.queryByText('Verkocht')).not.toBeInTheDocument()
  })

  it('flags a sold listing', async () => {
    await renderSuspended(Header, { props: { listing: listing({ isSold: true }) } })

    expect(screen.getByText('Verkocht')).toBeInTheDocument()
  })
})
