import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import AppHeader from './index.vue'

describe('AppHeader', () => {
  it('renders as a banner landmark', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('links the logo back to the home page', async () => {
    await renderSuspended(AppHeader)

    expect(screen.getByRole('link', { name: /Woningaanbod/i })).toHaveAttribute('href', '/')
  })
})
