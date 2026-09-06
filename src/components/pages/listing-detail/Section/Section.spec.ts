import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import Section from './index.vue'

describe('ListingDetailSection', () => {
  it('renders a visible heading above its slot content', async () => {
    await renderSuspended(Section, {
      props: { title: 'Locatie' },
      slots: { default: () => 'map goes here' },
    })

    const heading = screen.getByRole('heading', { name: 'Locatie' })
    expect(heading.className).not.toContain('sr-only')
    expect(screen.getByText('map goes here')).toBeInTheDocument()
  })

  it('keeps the heading for assistive tech only when srOnly is set', async () => {
    await renderSuspended(Section, { props: { title: 'Kenmerken', srOnly: true } })

    expect(screen.getByRole('heading', { name: 'Kenmerken' }).className).toContain('sr-only')
  })
})
