import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PropertyMap from './index.vue'

const meta: Meta<typeof PropertyMap> = {
  title: 'Molecules/PropertyMap',
  component: PropertyMap,
  tags: ['autodocs'],
  args: {
    coordinates: { lat: 51.51382, lng: 5.48473 },
    label: 'van Goghstraat 5, Son en Breugel',
  },
  decorators: [() => ({ template: '<div style="max-width: 42rem"><story /></div>' })],
}
export default meta

type Story = StoryObj<typeof PropertyMap>

export const Default: Story = {}

export const NoLocation: Story = {
  args: { coordinates: null },
}
