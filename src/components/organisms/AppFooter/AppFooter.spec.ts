import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import AppFooter from './index.vue'

describe('AppFooter', () => {
  it('renders as a contentinfo landmark', async () => {
    await renderSuspended(AppFooter)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('discloses that this is an unaffiliated demo', async () => {
    await renderSuspended(AppFooter)

    expect(screen.getByText(/not affiliated with funda/i)).toBeInTheDocument()
  })
})
