import { setResponseStatus } from 'h3'
import type { H3Event } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, registerEndpoint, renderSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtData } from '#app'
import { screen } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import type { ListingDetail } from '#shared/types/listing'
import DetailPage from './[id].vue'

const ID = 'efc3296e-c7cd-462f-ba9d-d6e04da0ebbf'

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ setView: vi.fn().mockReturnThis(), remove: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(() => ({ bindPopup: vi.fn() })) })),
    divIcon: vi.fn(),
  },
}))
vi.mock('leaflet/dist/leaflet.css', () => ({}))

// pass-through spy: keeps the real behaviour (so useFetch still tags error.value
// with statusCode) while letting us assert how the page maps an upstream failure
const { createErrorMock } = vi.hoisted(() => ({ createErrorMock: vi.fn() }))
mockNuxtImport('createError', (original) => {
  createErrorMock.mockImplementation(original as never)
  return createErrorMock
})

const detail = (over: Partial<ListingDetail> = {}): ListingDetail => ({
  id: ID,
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
  coordinates: { lat: 51.5, lng: 5.4 },
  has360Tour: false,
  hasVideo: false,
  hasFloorPlan: false,
  description: 'Een ruime hoekwoning met vrij uitzicht.',
  yearBuilt: 1963,
  bedrooms: 3,
  bathrooms: 1,
  energyLabel: 'C',
  photos: [
    { thumb: 'https://cloud.funda.nl/a_klein.jpg', full: 'https://cloud.funda.nl/a_groot.jpg' },
    { thumb: 'https://cloud.funda.nl/b_klein.jpg', full: 'https://cloud.funda.nl/b_groot.jpg' },
  ],
  features: [
    { title: 'Overdracht', items: [{ label: 'Vraagprijs', value: '€ 700.000 kosten koper' }] },
  ],
  ...over,
})

let respond: (event: H3Event) => unknown

registerEndpoint(`/api/listings/${ID}`, (event) => respond(event))

beforeEach(() => {
  // renderSuspended reuses one Nuxt app across tests, so useFetch would otherwise
  // serve the first test's cached payload to every later test
  clearNuxtData()
  respond = () => detail()
})

const render = () => renderSuspended(DetailPage, { route: `/listings/${ID}` })

describe('listing detail page', () => {
  it('renders the address, price, description and feature groups', async () => {
    await render()

    expect(screen.getByRole('heading', { level: 1, name: 'van Goghstraat 5' })).toBeInTheDocument()
    expect(screen.getByText('€ 700.000 k.k.')).toBeInTheDocument()
    expect(screen.getByText('Een ruime hoekwoning met vrij uitzicht.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Overdracht' })).toBeInTheDocument()
    expect(screen.getByText('€ 700.000 kosten koper')).toBeInTheDocument()
  })

  it('renders the photo gallery and the key facts', async () => {
    await render()

    expect(screen.getByRole('img', { name: /foto 1 van 2/i })).toBeInTheDocument()
    expect(screen.getByText('Bouwjaar')).toBeInTheDocument()
    expect(screen.getByText('1963')).toBeInTheDocument()
  })

  it('renders the location map once mounted', async () => {
    await render()
    await flushPromises()

    expect(
      screen.getByRole('application', { name: /van Goghstraat 5/i }),
    ).toBeInTheDocument()
  })

  it('surfaces an upstream 404 as a fatal error instead of rendering the page', async () => {
    respond = (event) => {
      setResponseStatus(event, 404)
      return { message: 'Listing not found' }
    }

    await render().catch(() => {})

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(createErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, fatal: true }),
    )
  })
})
