import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PhotoGallery from './index.vue'

const photos = [
  'https://cloud.funda.nl/valentina_media/227/572/214_groot.jpg',
  'https://cloud.funda.nl/valentina_media/227/572/200_groot.jpg',
  'https://cloud.funda.nl/valentina_media/227/572/201_groot.jpg',
]

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
