import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import type { ListingSummary } from '#shared/types/listing'
import Grid from './index.vue'

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

describe('ListingResultsGrid', () => {
  it('shows the result count and a linked card per listing', async () => {
    await renderSuspended(Grid, {
      props: {
        listings: [
          listing(),
          listing({ id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', address: 'Kerkstraat 1' }),
        ],
      },
    })

    expect(screen.getByText('2 woningen')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /van Goghstraat 5/ })).toHaveAttribute(
      'href',
      '/listings/efc3296e-c7cd-462f-ba9d-d6e04da0ebbf',
    )
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
