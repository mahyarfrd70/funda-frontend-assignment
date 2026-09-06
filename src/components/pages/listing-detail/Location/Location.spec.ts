import { describe, expect, it, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import Location from './index.vue'

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ setView: vi.fn().mockReturnThis(), remove: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(() => ({ bindPopup: vi.fn() })) })),
    divIcon: vi.fn(),
  },
}))
vi.mock('leaflet/dist/leaflet.css', () => ({}))

describe('ListingDetailLocation', () => {
  it('renders the map under a "Locatie" heading when coordinates are known', async () => {
    await renderSuspended(Location, {
      props: { coordinates: { lat: 51.5, lng: 5.4 }, label: 'van Goghstraat 5' },
    })
    await flushPromises()

    expect(screen.getByRole('heading', { name: 'Locatie' })).toBeInTheDocument()
    expect(screen.getByRole('application', { name: /van Goghstraat 5/i })).toBeInTheDocument()
  })

  it('falls back to a notice when the listing has no coordinates', async () => {
    await renderSuspended(Location, { props: { coordinates: null, label: 'x' } })
    await flushPromises()

    expect(screen.getByText('Locatie niet beschikbaar.')).toBeInTheDocument()
  })
})
