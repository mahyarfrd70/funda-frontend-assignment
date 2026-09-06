import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import DefaultLayout from './default.vue'

describe('default layout', () => {
  it('renders the header and footer landmarks', async () => {
    await renderSuspended(DefaultLayout)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders page content in the main region', async () => {
    await renderSuspended(DefaultLayout, {
      slots: { default: () => 'Page content' },
    })

    expect(screen.getByRole('main')).toHaveTextContent('Page content')
  })
})
