import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ListingPhoto } from '#shared/types/listing'
import PhotoGallery from './index.vue'

const shot = (n: string): ListingPhoto => ({
  thumb: `https://cloud.funda.nl/valentina_media/227/572/${n}_klein.jpg`,
  full: `https://cloud.funda.nl/valentina_media/227/572/${n}_groot.jpg`,
})

const photos = [shot('214'), shot('200'), shot('201')]

const meta: Meta<typeof PhotoGallery> = {
  title: 'Molecules/PhotoGallery',
  component: PhotoGallery,
  tags: ['autodocs'],
  args: { photos, alt: 'van Goghstraat 5' },
  decorators: [() => ({ template: '<div style="max-width: 42rem"><story /></div>' })],
}
export default meta

type Story = StoryObj<typeof PhotoGallery>

export const Default: Story = {}

export const SinglePhoto: Story = {
  args: { photos: photos.slice(0, 1) },
}

export const NoPhotos: Story = {
  args: { photos: [] },
}
