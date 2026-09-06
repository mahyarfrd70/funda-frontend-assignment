import { describe, expect, it, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, screen } from '@testing-library/vue'
import type { ListingPhoto } from '#shared/types/listing'
import PhotoGallery from './index.vue'

const photos: ListingPhoto[] = [
  { thumb: 'https://cloud.funda.nl/a_klein.jpg', full: 'https://cloud.funda.nl/a_groot.jpg' },
  { thumb: 'https://cloud.funda.nl/b_klein.jpg', full: 'https://cloud.funda.nl/b_groot.jpg' },
  { thumb: 'https://cloud.funda.nl/c_klein.jpg', full: 'https://cloud.funda.nl/c_groot.jpg' },
]

describe('PhotoGallery', () => {
  it('shows the first photo at full size with a counter', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'van Goghstraat 5' } })

    expect(screen.getByRole('img', { name: /foto 1 van 3/i })).toHaveAttribute(
      'src',
      photos[0]!.full,
    )
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('uses the small images for the thumbnail strip', async () => {
    const { container } = await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })

    const thumbs = [...container.querySelectorAll('li img')].map((img) => img.getAttribute('src'))
    expect(thumbs).toEqual([photos[0]!.thumb, photos[1]!.thumb, photos[2]!.thumb])
  })

  it('advances to the next photo — and its large image — with the next button', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })

    await fireEvent.click(screen.getByRole('button', { name: 'Volgende foto' }))

    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /foto 2 van 3/i })).toHaveAttribute(
      'src',
      photos[1]!.full,
    )
  })

  it('scrolls the active thumbnail into view when navigating', async () => {
    const scrollIntoView = vi
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(() => {})

    await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Volgende foto' }))

    expect(scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ inline: 'nearest', block: 'nearest' }),
    )

    scrollIntoView.mockRestore()
  })

  it('jumps to a photo via its thumbnail', async () => {
    await renderSuspended(PhotoGallery, { props: { photos, alt: 'x' } })

    await fireEvent.click(screen.getByRole('button', { name: 'Naar foto 3' }))

    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /foto 3 van 3/i })).toHaveAttribute(
      'src',
      photos[2]!.full,
    )
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
