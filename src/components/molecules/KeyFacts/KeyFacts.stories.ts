import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ListingDetail } from '#shared/types/listing'
import KeyFacts from './index.vue'

const listing: ListingDetail = {
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
  coordinates: { lat: 51.51382, lng: 5.48473 },
  has360Tour: true,
  hasVideo: true,
  hasFloorPlan: true,
  description: '',
  yearBuilt: 1963,
  bedrooms: 3,
  bathrooms: 1,
  energyLabel: 'C',
  photos: [],
  features: [],
}

const meta: Meta<typeof KeyFacts> = {
  title: 'Molecules/KeyFacts',
  component: KeyFacts,
  tags: ['autodocs'],
  args: { listing },
  decorators: [() => ({ template: '<div style="max-width: 40rem"><story /></div>' })],
}
export default meta

type Story = StoryObj<typeof KeyFacts>

export const Default: Story = {}

/** Only the facts that are actually known get rendered. */
export const Sparse: Story = {
  args: {
    listing: {
      ...listing,
      plotArea: 0,
      bedrooms: null,
      bathrooms: null,
      yearBuilt: null,
      energyLabel: null,
    },
  },
}
