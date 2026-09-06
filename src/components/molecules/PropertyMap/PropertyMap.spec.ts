import { describe, expect, it, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import PropertyMap from './index.vue'

const setView = vi.fn().mockReturnThis()

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ setView, remove: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(() => ({ bindPopup: vi.fn() })) })),
    divIcon: vi.fn(),
  },
}))
vi.mock('leaflet/dist/leaflet.css', () => ({}))

describe('PropertyMap', () => {
  it('renders a map region and centres Leaflet on the coordinates', async () => {
    await renderSuspended(PropertyMap, {
      props: { coordinates: { lat: 51.5, lng: 5.4 }, label: 'van Goghstraat 5' },
    })
    await flushPromises()

    expect(screen.getByRole('application', { name: /van Goghstraat 5/i })).toBeInTheDocument()
    const L = (await import('leaflet')).default
    expect(L.map).toHaveBeenCalled()
    expect(setView).toHaveBeenCalledWith([51.5, 5.4], 15)
  })

  it('shows a fallback and never touches Leaflet without coordinates', async () => {
    const L = (await import('leaflet')).default
    vi.mocked(L.map).mockClear()

    await renderSuspended(PropertyMap, { props: { coordinates: null, label: 'x' } })
    await flushPromises()

    expect(screen.getByText('Locatie niet beschikbaar.')).toBeInTheDocument()
    expect(L.map).not.toHaveBeenCalled()
  })
})
