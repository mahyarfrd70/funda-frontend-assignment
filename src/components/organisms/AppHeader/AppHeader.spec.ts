import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import AppHeader from './index.vue'

describe('AppHeader', () => {
  it('renders as a banner landmark', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('shows the site name', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getByText('Woningaanbod')).toBeInTheDocument()
  })

  it('links the logo back to the home page', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getByRole('link', { name: /Woningaanbod/i })).toHaveAttribute('href', '/')
  })

  it('has no other navigation — the logo is the only link', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('marks the house icon as decorative', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getByText('🏠')).toHaveAttribute('aria-hidden', 'true')
  })
})
