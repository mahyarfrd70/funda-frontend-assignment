import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ListingSummary } from '#shared/types/listing'
import ListingCard from './index.vue'

const sample: ListingSummary = {
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
  hasVideo: true,
  hasFloorPlan: true,
}

const meta: Meta<typeof ListingCard> = {
  title: 'Molecules/ListingCard',
  component: ListingCard,
  tags: ['autodocs'],
  args: { listing: sample },
  decorators: [() => ({ template: '<div style="max-width: 22rem"><story /></div>' })],
}
export default meta

type Story = StoryObj<typeof ListingCard>

export const Default: Story = {}

export const Sold: Story = {
  args: { listing: { ...sample, isSold: true } },
}

export const NoPhoto: Story = {
  args: { listing: { ...sample, thumbnail: null } },
}

export const PriceOnRequest: Story = {
  args: { listing: { ...sample, price: null, priceLabel: 'Prijs op aanvraag' } },
}
