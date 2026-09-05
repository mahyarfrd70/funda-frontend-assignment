import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, screen } from '@testing-library/vue'
import PhotoGallery from './index.vue'

const photos = [
  'https://cloud.funda.nl/a.jpg',
  'https://cloud.funda.nl/b.jpg',
  'https://cloud.funda.nl/c.jpg',
]

describe('PhotoGallery', () => {
  it('shows the first photo with a counter', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'van Goghstraat 5' } })

    expect(screen.getByRole('img', { name: /foto 1 van 3/i })).toHaveAttribute('src', photos[0])
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('advances to the next photo with the next button', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })

    await fireEvent.click(screen.getByRole('button', { name: 'Volgende foto' }))

    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /foto 2 van 3/i })).toHaveAttribute('src', photos[1])
  })

  it('jumps to a photo via its thumbnail', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })

    await fireEvent.click(screen.getByRole('button', { name: 'Naar foto 3' }))

    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('hides prev on the first photo and next on the last', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })
    expect(screen.queryByRole('button', { name: 'Vorige foto' })).not.toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: 'Naar foto 3' }))
    expect(screen.queryByRole('button', { name: 'Volgende foto' })).not.toBeInTheDocument()
  })

  it('shows a fallback when there are no photos', async () => {
    await renderSuspended(PhotoGallery, { props: { photos: [], alt: 'x' } })

    expect(screen.getByText(/geen foto's beschikbaar/i)).toBeInTheDocument()
  })
})
