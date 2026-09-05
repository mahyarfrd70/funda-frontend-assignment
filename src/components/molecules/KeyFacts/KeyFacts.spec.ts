import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import type { ListingDetail } from '#shared/types/listing'
import KeyFacts from './index.vue'

const base: ListingDetail = {
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
  description: '...',
  yearBuilt: 1963,
  bedrooms: 3,
  bathrooms: 1,
  energyLabel: 'C',
  photos: [],
  features: [],
}

describe('KeyFacts', () => {
  it('renders the facts it has', async () => {
    await renderSuspended(KeyFacts, { props: { listing: base } })

    expect(screen.getByText('Woonoppervlakte')).toBeInTheDocument()
    expect(screen.getByText('151 m²')).toBeInTheDocument()
    expect(screen.getByText('Bouwjaar')).toBeInTheDocument()
    expect(screen.getByText('1963')).toBeInTheDocument()
    expect(screen.getByText('PAR-3 Makelaars')).toBeInTheDocument()
  })

  it('renders the energy label as a badge', async () => {
    await renderSuspended(KeyFacts, { props: { listing: base } })

    expect(screen.getByText('Energielabel')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('omits facts that are missing or zero', async () => {
    await renderSuspended(KeyFacts, {
      props: { listing: { ...base, plotArea: 0, yearBuilt: null, energyLabel: null } },
    })

    expect(screen.queryByText('Perceeloppervlakte')).not.toBeInTheDocument()
    expect(screen.queryByText('Bouwjaar')).not.toBeInTheDocument()
    expect(screen.queryByText('Energielabel')).not.toBeInTheDocument()
  })
})
